/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { Link, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {IProject, fetchProjects, getProjectImageUrls} from '../../services/queries';

const Project = () => {
  const [projects, setProjects] = useState<IProject[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      const fetchedProjects = await fetchProjects();
      setProjects(fetchedProjects);
    };

    loadProjects();
  }, []);

  return (
      <div className="flex flex-col min-h-screen mb-5">
        <div className="max-w-7xl mx-auto mt-20 space-y-4 px-4 md:px-6">
          <h2 className="text-center text-2xl font-bold text-gray-700 mb-5 shadow-sm font-serif">
            PROJELERİMİZ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-20">
            {projects.map((project) => {
              const projectImageUrls = getProjectImageUrls(project);
              return (
                  <Link to={`/project/${project._id}`} key={project._id}>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <img
                          src={projectImageUrls[0]}
                          alt={project.name}
                          className="w-full h-64 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-700 line-clamp-2">
                          {project.name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {project.subtitle}
                        </p>
                      </div>
                    </div>
                  </Link>
              );
            })}
          </div>
        </div>
        <Outlet />
      </div>
  );
};

export default Project;