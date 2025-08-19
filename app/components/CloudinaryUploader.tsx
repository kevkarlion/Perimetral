'use client';

import { useState } from 'react';

interface CloudinaryUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  existingImages?: string[];
  folder?: string;
}

export default function CloudinaryUploader({ 
  onImageUpload, 
  existingImages = [], 
  folder = 'products' 
}: CloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          alert('Solo se permiten imágenes JPEG, PNG, GIF y WEBP');
          continue;
        }

        // Validar tamaño (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          alert('La imagen es demasiado grande. Máximo 5MB');
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        formData.append('upload_preset', 'ml_default'); // Asegúrate de crear este preset en Cloudinary

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Error al subir la imagen');
        }

        const data = await response.json();
        
        if (data.success) {
          onImageUpload(data.data.url);
          setUploadProgress(((i + 1) / files.length) * 100);
        } else {
          console.error('Error en la subida:', data.error);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mostrar imágenes existentes */}
      {/* {existingImages.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Imágenes existentes:</h4>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {existingImages.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`Imagen ${index + 1}`}
                  className="w-20 h-20 object-cover rounded border"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      // Aquí podrías agregar funcionalidad para eliminar
                      console.log('Eliminar imagen:', img);
                    }}
                    className="text-white text-sm bg-red-500 rounded px-2 py-1"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Uploader */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {isUploading ? (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">Subiendo imágenes...</p>
          </div>
        ) : (
          <>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-4 flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Subir imágenes
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </label>
              <p className="pl-1">o arrastra y suelta</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF, WEBP hasta 5MB
            </p>
          </>
        )}
      </div>
    </div>
  );
}