import { useRef } from 'react';

interface PhotoUploadProps {
  preview: string;
  onFileChange: (file: File) => void;
  error?: string;
}

export function PhotoUpload({ preview, onFileChange, error }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
      alert('Solo se aceptan archivos JPG/JPEG.');
      return;
    }
    if (file.size > 100 * 1024) {
      alert('El archivo es demasiado grande. Máximo 100 KB.');
      return;
    }
    onFileChange(file);
  }

  return (
    <div className="md:col-span-2 space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-[#666685] px-1">
        Subir Fotografía
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-[#b3b3c2] bg-[#f6f5fa] rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-[#ccccd6] transition-all cursor-pointer group"
      >
        {preview ? (
          <img
            src={preview}
            alt="Foto preview"
            className="w-32 h-auto rounded-xl object-cover shadow"
          />
        ) : (
          <>
            <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[#0a29cd] text-3xl">add_a_photo</span>
            </div>
            <div className="text-center">
              <p className="text-[#000033] font-bold">Haz clic o arrastra tu foto aquí</p>
              <p className="text-xs text-[#666685] mt-1">Cumple con los requerimientos indicados</p>
            </div>
          </>
        )}
        <button
          type="button"
          className="mt-2 text-sm font-bold text-[#0a29cd] hover:underline"
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        >
          {preview ? 'Cambiar archivo' : 'Seleccionar archivo'}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg"
        className="hidden"
        onChange={handleChange}
      />
      {error && <p className="text-xs text-red-500 px-1">{error}</p>}
    </div>
  );
}
