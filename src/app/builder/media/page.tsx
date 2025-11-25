import { Shell } from '@/components/layout/Shell';
import { getUploadedFiles } from '@/actions/upload';
import { MediaLibrary } from '@/components/builder/MediaLibrary';
import { Image as ImageIcon, HardDrive } from 'lucide-react';

export default async function MediaPage() {
  const files = await getUploadedFiles();
  
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <ImageIcon className="w-8 h-8" />
            Media Library
          </h1>
          <p className="text-slate-400 mt-2">
            Upload and manage images for your website.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Total Files</div>
                <div className="text-3xl font-bold text-white mt-1">{files.length}</div>
              </div>
              <ImageIcon className="w-12 h-12 text-indigo-500/50" />
            </div>
          </div>
          
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Storage Used</div>
                <div className="text-3xl font-bold text-white mt-1">{totalSizeMB} MB</div>
              </div>
              <HardDrive className="w-12 h-12 text-purple-500/50" />
            </div>
          </div>
        </div>

        {/* Media Library */}
        <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">All Images</h2>
          <MediaLibrary existingFiles={files} />
        </div>
      </div>
    </Shell>
  );
}
