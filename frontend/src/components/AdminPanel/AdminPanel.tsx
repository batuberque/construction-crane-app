import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TbPencil, TbPlus, TbTrash } from 'react-icons/tb';

import Page from '../../lib/ui/Page';
import Modal from '../../lib/ui/modal';
import ProjectModal from './ProjectModal';
import { IProject, deleteProject, fetchProjects, getProjectImageUrls } from '../../services/queries';

const AdminPanel = () => {
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading, isError, refetch } = useQuery<IProject[], Error>(
    ['projects'],
    fetchProjects
  );

  const [editing, setEditing] = useState<IProject | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<IProject | null>(null);

  const removeProject = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      void queryClient.invalidateQueries(['projects']);
      setPendingDelete(null);
    },
  });

  const openForm = (project: IProject | null) => {
    setEditing(project);
    setIsFormOpen(true);
  };

  return (
    <Page>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="spec text-concrete mb-2">Yönetim</p>
            <h1 className="text-display-m font-bold uppercase">Projeler</h1>
          </div>
          <button
            type="button"
            onClick={() => openForm(null)}
            className="inline-flex items-center gap-2 bg-hazard px-5 py-3 spec font-medium text-graphite hover:bg-hazard/90 transition-colors"
          >
            <TbPlus aria-hidden="true" className="text-base" /> Yeni proje
          </button>
        </div>

        {isLoading && (
          <ul className="mt-10 divide-y divide-steel-line border-y border-steel-line">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="flex items-center gap-4 py-4">
                <div className="h-16 w-24 shrink-0 animate-pulse bg-steel" />
                <div className="flex-1">
                  <div className="h-4 w-1/3 animate-pulse bg-steel" />
                  <div className="mt-2 h-3 w-1/5 animate-pulse bg-steel" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {isError && (
          <div className="mt-10 border border-steel-line p-8 text-center">
            <p>Projeler yüklenemedi.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 inline-flex items-center bg-hazard px-5 py-2.5 spec text-graphite hover:bg-hazard/90 transition-colors"
            >
              Tekrar deneyin
            </button>
          </div>
        )}

        {!isLoading && !isError && projects.length === 0 && (
          <div className="mt-10 border border-dashed border-steel-line p-12 text-center">
            <p className="text-body-l">Henüz proje eklenmemiş.</p>
            <p className="mt-2 text-concrete">
              İlk projenizi ekleyin; sitede Projeler sayfasında görünecek.
            </p>
            <button
              type="button"
              onClick={() => openForm(null)}
              className="mt-6 inline-flex items-center gap-2 bg-hazard px-5 py-3 spec font-medium text-graphite hover:bg-hazard/90 transition-colors"
            >
              <TbPlus aria-hidden="true" className="text-base" /> Yeni proje
            </button>
          </div>
        )}

        {projects.length > 0 && (
          <ul className="mt-10 divide-y divide-steel-line border-y border-steel-line">
            {projects.map((project) => {
              // Was built from the API host; every other consumer uses GCS.
              const [cover] = getProjectImageUrls(project);
              return (
                <li key={project._id} className="flex items-center gap-4 py-4">
                  <div className="h-16 w-24 shrink-0 overflow-hidden bg-steel">
                    {cover && (
                      <img
                        src={cover}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{project.name}</p>
                    {project.subtitle && (
                      <p className="spec mt-1 truncate text-concrete">{project.subtitle}</p>
                    )}
                    <p className="spec mt-1 text-concrete">
                      {project.images.length} görsel
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => openForm(project)}
                      aria-label={`${project.name} projesini düzenle`}
                      className="p-2.5 text-concrete hover:text-signal transition-colors"
                    >
                      <TbPencil aria-hidden="true" className="text-xl" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(project)}
                      aria-label={`${project.name} projesini sil`}
                      className="p-2.5 text-concrete hover:text-red-400 transition-colors"
                    >
                      <TbTrash aria-hidden="true" className="text-xl" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {isFormOpen && (
        <ProjectModal
          project={editing}
          onClose={() => setIsFormOpen(false)}
          onSaved={() => void queryClient.invalidateQueries(['projects'])}
        />
      )}

      {/* The delete button used to fire immediately with no confirmation, while
          the modal's "Sil" button asked for confirmation and then deleted
          nothing. */}
      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Projeyi silin"
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setPendingDelete(null)}
              className="px-5 py-2.5 spec border border-steel-line hover:bg-steel transition-colors"
            >
              Vazgeçin
            </button>
            <button
              type="button"
              disabled={removeProject.isLoading}
              onClick={() => pendingDelete?._id && removeProject.mutate(pendingDelete._id)}
              className="px-5 py-2.5 spec font-medium bg-red-700 text-white hover:bg-red-800 disabled:opacity-50 transition-colors"
            >
              {removeProject.isLoading ? 'Siliniyor…' : 'Silin'}
            </button>
          </div>
        }
      >
        <p>
          <strong>{pendingDelete?.name}</strong> projesi kalıcı olarak silinecek.
          Bu işlem geri alınamaz.
        </p>
        {removeProject.isError && (
          <p role="alert" className="mt-4 border-l-2 border-red-500 bg-steel p-3">
            Proje silinemedi. Lütfen tekrar deneyin.
          </p>
        )}
      </Modal>
    </Page>
  );
};

export default AdminPanel;
