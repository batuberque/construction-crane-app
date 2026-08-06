import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Page from '../../lib/ui/Page';
import { IProject, fetchProjects, getProjectImageUrls } from '../../services/queries';

const CARD_W = 640;
const CARD_H = 420;

const ProjectCard = ({ project }: { project: IProject }) => {
  const [cover] = getProjectImageUrls(project);

  return (
    <li className="border-b border-r border-steel-line">
      <Link to={`/project/${project._id ?? ''}`} className="group block">
        <div className="relative aspect-[3/2] overflow-hidden bg-steel">
          {cover ? (
            <img
              src={cover}
              alt=""
              width={CARD_W}
              height={CARD_H}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="spec text-concrete">Görsel yok</span>
            </div>
          )}
        </div>
        <div className="p-5">
          <h2 className="text-display-m font-semibold group-hover:text-hazard transition-colors">
            {project.name}
          </h2>
          {project.subtitle && (
            <p className="spec mt-2 text-concrete">{project.subtitle}</p>
          )}
        </div>
      </Link>
    </li>
  );
};

const Project = () => {
  // Same key AdminPanel uses, so the two share one cache entry.
  const { data: projects = [], isLoading, isError, refetch } = useQuery(
    ['projects'],
    fetchProjects
  );

  return (
    <Page>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <p className="spec text-hazard mb-4">Projeler</p>
        <h1 className="text-display-l font-bold uppercase max-w-[18ch]">
          Tamamladığımız işler
        </h1>

        {isLoading && (
          <ul className="mt-14 grid border-l border-t border-steel-line sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="border-b border-r border-steel-line">
                <div className="aspect-[3/2] animate-pulse bg-steel" />
                <div className="p-5">
                  <div className="h-5 w-2/3 animate-pulse bg-steel" />
                  <div className="mt-3 h-3 w-1/3 animate-pulse bg-steel" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {isError && (
          <div className="mt-14 border border-steel-line p-10 text-center">
            <p className="text-body-l">Projeler yüklenemedi.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-5 inline-flex items-center bg-hazard px-5 py-3 spec font-medium text-graphite hover:bg-hazard/90 transition-colors"
            >
              Tekrar deneyin
            </button>
          </div>
        )}

        {!isLoading && !isError && projects.length === 0 && (
          <div className="mt-14 border border-steel-line p-10 text-center">
            <p className="text-body-l">Henüz yayımlanmış bir proje yok.</p>
          </div>
        )}

        {/* Project count is dynamic, so a gap-px + parent-background grid would
            paint empty filler cells on any count that isn't a multiple of the
            column count. Borders live on the cells instead. */}
        {projects.length > 0 && (
          <ul className="mt-14 grid border-l border-t border-steel-line sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </ul>
        )}
      </div>
    </Page>
  );
};

export default Project;
