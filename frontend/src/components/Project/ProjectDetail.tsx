import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TbArrowRight, TbChevronLeft } from 'react-icons/tb';

import Page from '../../lib/ui/Page';
import ImageSlider from '../../lib/ui/imageSlider';
import { IProject, fetchProjectById, getProjectImageUrls } from '../../services/queries';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: project, isLoading, isError } = useQuery(
    ['projects', id],
    () => fetchProjectById(id as string),
    {
      enabled: Boolean(id),
      // Seed from the list so arriving from the grid renders with no spinner.
      initialData: () =>
        queryClient
          .getQueryData<IProject[]>(['projects'])
          ?.find((p) => p._id === id),
      initialDataUpdatedAt: () => queryClient.getQueryState(['projects'])?.dataUpdatedAt,
    }
  );

  // Derived in render — the old version wrote absolutised URLs back into state,
  // which re-absolutised them whenever the cache warmed.
  const images = project ? getProjectImageUrls(project) : [];

  return (
    <Page>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <Link
          to="/project"
          className="spec inline-flex items-center gap-1.5 text-concrete hover:text-hazard transition-colors"
        >
          <TbChevronLeft aria-hidden="true" /> Tüm projeler
        </Link>

        {isLoading && (
          <div className="mt-8">
            <div className="aspect-[3/2] animate-pulse bg-steel" />
            <div className="mt-8 h-9 w-2/3 animate-pulse bg-steel" />
            <div className="mt-4 h-4 w-full animate-pulse bg-steel" />
            <div className="mt-2 h-4 w-5/6 animate-pulse bg-steel" />
          </div>
        )}

        {isError && (
          <div className="mt-8 border border-steel-line p-10 text-center">
            <p className="text-body-l">Bu proje bulunamadı.</p>
            <Link
              to="/project"
              className="mt-5 inline-flex items-center gap-2 bg-hazard px-5 py-3 spec font-medium text-graphite hover:bg-hazard/90 transition-colors"
            >
              Projelere dönün <TbArrowRight aria-hidden="true" />
            </Link>
          </div>
        )}

        {project && (
          <article className="mt-8">
            <ImageSlider images={images} alt={project.name} />

            <header className="mt-10">
              <h1 className="text-display-l font-bold uppercase">{project.name}</h1>
              {project.subtitle && (
                <p className="spec mt-3 text-hazard">{project.subtitle}</p>
              )}
            </header>

            {project.description && (
              <p className="mt-8 max-w-prose text-body-l leading-relaxed text-concrete whitespace-pre-line">
                {project.description}
              </p>
            )}

            <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-steel-line pt-8">
              <p className="text-body-l">Benzer bir işiniz mi var?</p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-hazard px-6 py-3.5 spec font-medium text-graphite hover:bg-hazard/90 transition-colors"
              >
                Teklif alın <TbArrowRight aria-hidden="true" />
              </Link>
            </div>
          </article>
        )}
      </div>
    </Page>
  );
};

export default ProjectDetail;
