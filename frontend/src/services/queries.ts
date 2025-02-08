/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import axiosInstance from './axios';
import { useMutation } from '@tanstack/react-query';

export const imageBaseURL = 'https://storage.googleapis.com/vinc-key-images';

// EMAİL QUERIES
export interface Email {
  email: string;
  subject: string;
  message: string;
  captchaToken?: string;
}

export const fetchEmails = async (): Promise<Email[]> => {
  const response = await axiosInstance.get<Email[]>('/emails');
  return response.data;
};

export const sendEmail = async (emailData: Email): Promise<string> => {
  try {
    const response = await axiosInstance.post<string>('/contact', emailData);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const deleteEmail = async (email: string): Promise<string> => {
  const response = await axiosInstance.delete<string>(`/${email}`);
  return response.data;
};

// USER QUERIES
export interface LoginResponse {
  role: string;
  username: string;
  accessToken: string;
}

interface User {
  username: string;
  password: string;
}

export const useLoginUser = () => {
  return useMutation(
    async ({ username, password }: User): Promise<LoginResponse> => {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', {
        username,
        password,
      });
      return response.data;
    }
  );
};

// PROJECT QUERIES
export interface IProject {
  _id?: string | undefined;
  name: string;
  images: string[];
  description?: string;
  subtitle?: string;
}

export const fetchProjects = async (): Promise<IProject[]> => {
  const response = await axiosInstance.get<IProject[]>('/project');
  return response.data;
};

// Fetch a single project by ID
export const fetchProjectById = async (id: string): Promise<IProject> => {
  const response = await axiosInstance.get<IProject[]>(`/project/${id}`);
  return response.data[0];
};

// Create a new project
export const createProject = async (
  projectData: FormData
): Promise<IProject> => {
  const response = await axiosInstance.post<IProject>('/project', projectData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update an existing project with FormData
export const updateProject = async (
  id: string,
  projectData: FormData
): Promise<IProject> => {
  const response = await axiosInstance.put<IProject>(
    `/project/${id}`,
    projectData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// Delete a project
export const deleteProject = async (
  id: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete<{ message: string }>(
    `/project/${id}`
  );
  return response.data;
};

// Bu fonksiyon, projenin resimlerine ait tam URL'leri döndürür
export const getProjectImageUrls = (project: IProject): string[] => {
  return project.images.map(
      (image) => `${imageBaseURL}/${image}`
  );
};

// delete url: http://localhost:3005/project/65a12bee34965ed83370041d/images/uploads/images-1705063864626.PNG
export const deleteProjectImage = async (
  projectId: string,
  imageName: string
): Promise<{
  status: number;
  message: string;
  deletedImage: string;
}> => {
  const response = await axiosInstance.delete<{
    status: number;
    message: string;
  }>(`/project/${projectId}/images/uploads/${imageName}`);
  return { ...response.data, deletedImage: imageName };
};
