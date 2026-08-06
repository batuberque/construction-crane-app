import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { TbAlertTriangle, TbPhotoPlus, TbX } from 'react-icons/tb';

import Modal from '../../lib/ui/modal';
import {
  IProject,
  createProject,
  deleteProjectImage,
  imageBaseURL,
  updateProject,
} from '../../services/queries';

type Props = {
  project: IProject | null;
  onClose: () => void;
  onSaved: () => void;
};

const MAX_IMAGES = 10; // backend/lib/multerConfig caps uploads at 10
const ACCEPT = 'image/png,image/jpeg';

const inputClass =
  'w-full border border-steel-line bg-steel px-3.5 py-2.5 text-signal focus:border-hazard transition-colors';

const ProjectModal = ({ project, onClose, onSaved }: Props) => {
  const isEdit = Boolean(project?._id);

  const [name, setName] = useState(project?.name ?? '');
  const [subtitle, setSubtitle] = useState(project?.subtitle ?? '');
  const [description, setDescription] = useState(project?.description ?? '');

  // Server-side images and newly picked files are tracked separately. Conflating
  // them is what made the remove button inert in create mode and made it fire a
  // bogus server DELETE for blob: previews in edit mode.
  const [existingImages, setExistingImages] = useState<string[]>(project?.images ?? []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Blob URLs were never revoked, leaking for the modal's lifetime.
  useEffect(
    () => () => newPreviews.forEach((url) => URL.revokeObjectURL(url)),
    [newPreviews]
  );

  const save = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('subtitle', subtitle.trim());
      formData.append('description', description.trim());
      newFiles.forEach((file) => formData.append('images', file));

      if (isEdit && project?._id) return updateProject(project._id, formData);
      return createProject(formData);
    },
    onSuccess: () => {
      onSaved();
      onClose();
    },
  });

  const removeExisting = useMutation({
    mutationFn: async (url: string) => {
      const imageName = url.replace(`${imageBaseURL}/uploads/`, '');
      if (!project?._id) throw new Error('missing project id');
      await deleteProjectImage(project._id, imageName);
      return url;
    },
    onSuccess: (url) => setExistingImages((prev) => prev.filter((p) => `${imageBaseURL}/${p}` !== url)),
  });

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length === 0) return;

    const room = MAX_IMAGES - newFiles.length;
    const accepted = picked.slice(0, Math.max(room, 0));
    if (accepted.length < picked.length) {
      setFormError(`Tek seferde en fazla ${MAX_IMAGES} görsel yükleyebilirsiniz.`);
    }

    setNewFiles((prev) => [...prev, ...accepted]);
    setNewPreviews((prev) => [...prev, ...accepted.map((f) => URL.createObjectURL(f))]);
    // Allow re-picking the same file after a removal.
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeNewFile = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
    setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Proje adı zorunlu.');
      return;
    }
    setFormError(null);
    save.mutate();
  };

  // Known backend behaviour, not something the client can work around:
  // PUT /project/:id replaces the whole images array when files are attached.
  const willReplaceImages = isEdit && newFiles.length > 0 && existingImages.length > 0;

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={isEdit ? 'Projeyi düzenleyin' : 'Yeni proje'}
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 spec border border-steel-line hover:bg-steel transition-colors"
          >
            Vazgeçin
          </button>
          <button
            type="submit"
            form="project-form"
            disabled={save.isLoading}
            className="px-5 py-2.5 spec font-medium bg-hazard text-graphite hover:bg-hazard/90 disabled:opacity-50 transition-colors"
          >
            {save.isLoading ? 'Kaydediliyor…' : 'Kaydedin'}
          </button>
        </div>
      }
    >
      <form id="project-form" onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="name" className="spec mb-2 block">
            Proje adı
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            maxLength={80}
          />
        </div>

        <div>
          <label htmlFor="subtitle" className="spec mb-2 block">
            Alt başlık
          </label>
          <input
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className={inputClass}
            maxLength={280}
            placeholder="Konum / Yıl"
          />
          <p className="mt-2 text-sm text-concrete">
            Proje kartlarında teknik satır olarak görünür — örneğin “Aliağa / 2019”.
          </p>
        </div>

        <div>
          <label htmlFor="description" className="spec mb-2 block">
            Açıklama
          </label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <span className="spec mb-2 block">Görseller</span>

          <label
            htmlFor="images"
            className="flex cursor-pointer items-center justify-center gap-2 border border-dashed border-steel-line px-4 py-6 text-concrete hover:border-hazard hover:text-signal transition-colors"
          >
            <TbPhotoPlus aria-hidden="true" className="text-xl" />
            <span className="spec">Görsel seçin (JPG / PNG, en fazla {MAX_IMAGES})</span>
          </label>
          <input
            ref={fileInputRef}
            id="images"
            type="file"
            multiple
            accept={ACCEPT}
            onChange={handleFiles}
            className="sr-only"
          />

          {willReplaceImages && (
            <p className="mt-4 flex gap-3 border-l-2 border-red-500 bg-steel p-3 text-sm">
              <TbAlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-lg text-red-400" />
              <span>
                Kaydettiğinizde sunucu mevcut {existingImages.length} görseli
                yeni yüklediklerinizle <strong>değiştirir</strong>. Eskilerini
                korumak istiyorsanız önce onları tek tek silmeyin — bu bir sunucu
                davranışıdır ve düzeltilmesi backend değişikliği gerektirir.
              </span>
            </p>
          )}

          {(existingImages.length > 0 || newPreviews.length > 0) && (
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {existingImages.map((path) => {
                const url = `${imageBaseURL}/${path}`;
                return (
                  <li key={path} className="relative">
                    <img
                      src={url}
                      alt=""
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExisting.mutate(url)}
                      disabled={removeExisting.isLoading}
                      aria-label="Bu görseli sunucudan silin"
                      className="absolute right-1 top-1 bg-graphite/80 p-1.5 text-signal hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      <TbX aria-hidden="true" />
                    </button>
                  </li>
                );
              })}

              {newPreviews.map((url, i) => (
                <li key={url} className="relative">
                  <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
                  <span className="spec absolute bottom-1 left-1 bg-graphite/80 px-1.5 py-0.5 text-signal">
                    Yeni
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNewFile(i)}
                    aria-label="Bu görseli listeden çıkarın"
                    className="absolute right-1 top-1 bg-graphite/80 p-1.5 text-signal hover:bg-red-700 transition-colors"
                  >
                    <TbX aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {removeExisting.isError && (
            <p role="alert" className="mt-3 border-l-2 border-red-500 bg-steel p-3 text-sm">
              Görsel silinemedi. Lütfen tekrar deneyin.
            </p>
          )}
        </div>

        <div aria-live="polite">
          {formError && (
            <p role="alert" className="border-l-2 border-red-500 bg-steel p-3">
              {formError}
            </p>
          )}
          {save.isError && (
            <p role="alert" className="border-l-2 border-red-500 bg-steel p-3">
              Proje kaydedilemedi. Lütfen tekrar deneyin.
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;
