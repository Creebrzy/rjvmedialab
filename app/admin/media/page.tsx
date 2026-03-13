'use client';
export const runtime = 'edge';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, ExternalLink, Film, FolderOpen, Check, X, Play, Image as ImageIcon, AlertCircle } from 'lucide-react';

const SECTIONS = ['hero', 'gallery', 'shows', 'studios', 'team', 'about'];
const blank = { title: '', section: 'gallery', source_url: '', alt_text: '', sort_order: 0, force_type: '' };

type MediaItem = any;
type DriveFile = { id: string; name: string; media_type: string; thumbnail_url: string | null; direct_url: string; selected?: boolean };

function MediaThumb({ item, onClick }: { item: MediaItem; onClick: () => void }) {
  if (item.media_type === 'video') {
    return (
      <div className="aspect-video relative bg-void overflow-hidden cursor-pointer group" onClick={onClick}>
        {item.thumbnail_url
          ? <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center bg-void-3"><Film size={24} className="text-gold/30" /></div>}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gold/80 flex items-center justify-center"><Play size={14} className="text-void ml-0.5" fill="currentColor" /></div>
        </div>
      </div>
    );
  }
  return (
    <div className="aspect-video relative bg-void-3 overflow-hidden cursor-pointer group" onClick={onClick}>
      <img src={item.direct_url} alt={item.alt_text || item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
    </div>
  );
}

export default function AdminMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [importing, setImporting] = useState(false);
  const [form, setForm] = useState({ ...blank });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [preview, setPreview] = useState<MediaItem | null>(null);

  // Bulk import state
  const [folderUrl, setFolderUrl] = useState('');
  const [folderFiles, setFolderFiles] = useState<DriveFile[]>([]);
  const [folderLoading, setFolderLoading] = useState(false);
  const [folderError, setFolderError] = useState('');
  const [importSection, setImportSection] = useState('gallery');
  const [importPrefix, setImportPrefix] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number } | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const r = await fetch('/api/admin/media');
    const data = await r.json();
    if (Array.isArray(data)) setMedia(data);
    setLoading(false);
  }

  async function save() {
    if (!form.source_url || !form.title) return;
    setSaving(true);
    await fetch('/api/admin/media', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ ...blank });
    setAdding(false);
    setSaving(false);
    load();
  }

  async function toggle(item: MediaItem) {
    await fetch('/api/admin/media', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, is_active: !item.is_active, sort_order: item.sort_order }) });
    load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this media?')) return;
    await fetch('/api/admin/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  }

  // Folder import
  async function previewFolder() {
    if (!folderUrl) return;
    setFolderLoading(true);
    setFolderError('');
    setFolderFiles([]);
    setImportResult(null);
    const r = await fetch(`/api/admin/media/import?folder=${encodeURIComponent(folderUrl)}`);
    const data = await r.json();
    if (data.error) { setFolderError(data.error); setFolderLoading(false); return; }
    setFolderFiles(data.files.map((f: DriveFile) => ({ ...f, selected: true })));
    setFolderLoading(false);
  }

  function toggleFile(id: string) {
    setFolderFiles(files => files.map(f => f.id === id ? { ...f, selected: !f.selected } : f));
  }

  function selectAll(val: boolean) {
    setFolderFiles(files => files.map(f => ({ ...f, selected: val })));
  }

  async function importSelected() {
    const selected = folderFiles.filter(f => f.selected);
    if (!selected.length) return;
    setImportLoading(true);
    const r = await fetch('/api/admin/media/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: selected, section: importSection, prefix_title: importPrefix }),
    });
    const data = await r.json();
    setImportResult(data);
    setImportLoading(false);
    setFolderFiles([]);
    setFolderUrl('');
    load();
  }

  const filtered = media
    .filter(m => filter === 'all' || m.section === filter)
    .filter(m => typeFilter === 'all' || m.media_type === typeFilter);

  const imgCount = media.filter(m => m.media_type === 'image').length;
  const vidCount = media.filter(m => m.media_type === 'video').length;
  const selectedCount = folderFiles.filter(f => f.selected).length;

  return (
    <div>
      <div className="gold-line mb-4" />
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-5xl text-white">MEDIA MANAGER</h1>
          <p className="font-mono text-white/30 text-xs tracking-widest mt-2">{imgCount} photos · {vidCount} videos</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setImporting(!importing); setAdding(false); }}
            className={`flex items-center gap-2 font-mono text-xs px-5 py-3 tracking-widest uppercase transition-colors ${importing ? 'bg-gold text-void' : 'border border-gold text-gold hover:bg-gold hover:text-void'}`}>
            <FolderOpen size={14} /> Bulk Import
          </button>
          <button onClick={() => { setAdding(!adding); setImporting(false); }}
            className={`flex items-center gap-2 font-mono text-xs px-5 py-3 tracking-widest uppercase transition-colors ${adding ? 'bg-gold text-void' : 'bg-gold/10 text-gold hover:bg-gold hover:text-void'}`}>
            <Plus size={14} /> Add One
          </button>
        </div>
      </div>

      {/* Import result banner */}
      {importResult && (
        <div className="bg-green-900/20 border border-green-400/30 p-4 mb-6 flex items-center justify-between">
          <div className="font-mono text-green-400 text-sm">
            ✓ Imported {importResult.imported} files{importResult.skipped > 0 ? ` · ${importResult.skipped} skipped` : ''}
          </div>
          <button onClick={() => setImportResult(null)} className="text-white/30 hover:text-white"><X size={14} /></button>
        </div>
      )}

      {/* BULK IMPORT PANEL */}
      {importing && (
        <div className="bg-void-2 border border-gold/30 p-6 mb-8">
          <div className="font-mono text-gold text-xs tracking-widest uppercase mb-6">Bulk Import from Google Drive Folder</div>

          <div className="bg-gold/5 border border-gold/10 p-4 mb-6 font-mono text-xs text-white/40 leading-relaxed space-y-1">
            <div><span className="text-gold">Step 1:</span> In Google Drive, right-click your folder → Share → "Anyone with the link"</div>
            <div><span className="text-gold">Step 2:</span> Copy the folder link and paste below</div>
            <div><span className="text-gold">Step 3:</span> Preview files, select which to import, set section, then Import</div>
            <div><span className="text-gold">Note:</span> Requires GOOGLE_DRIVE_API_KEY set in Cloudflare environment variables</div>
          </div>

          <div className="flex gap-3 mb-6">
            <input value={folderUrl} onChange={e => setFolderUrl(e.target.value)}
              className="flex-1 bg-void border border-white/10 text-white font-mono text-sm px-4 py-3 focus:border-gold outline-none"
              placeholder="https://drive.google.com/drive/folders/..." />
            <button onClick={previewFolder} disabled={!folderUrl || folderLoading}
              className="bg-gold text-void font-mono text-xs px-6 py-3 tracking-widest uppercase hover:bg-gold-light transition-colors disabled:opacity-40 whitespace-nowrap">
              {folderLoading ? 'Loading...' : 'Preview Folder'}
            </button>
          </div>

          {folderError && (
            <div className="flex items-center gap-2 text-red-400 font-mono text-sm mb-4">
              <AlertCircle size={14} /> {folderError}
            </div>
          )}

          {folderFiles.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="font-mono text-white/30 text-xs tracking-widest uppercase block mb-2">Import to Section *</label>
                  <select value={importSection} onChange={e => setImportSection(e.target.value)}
                    className="w-full bg-void border border-white/10 text-white font-mono text-sm px-4 py-3 focus:border-gold outline-none capitalize">
                    {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="font-mono text-white/30 text-xs tracking-widest uppercase block mb-2">Title Prefix (optional)</label>
                  <input value={importPrefix} onChange={e => setImportPrefix(e.target.value)}
                    className="w-full bg-void border border-white/10 text-white font-mono text-sm px-4 py-3 focus:border-gold outline-none"
                    placeholder="e.g. Studio Session — (added before each filename)" />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-white/40 text-xs">{folderFiles.length} files found · {selectedCount} selected</div>
                <div className="flex gap-3">
                  <button onClick={() => selectAll(true)} className="font-mono text-xs text-gold hover:text-gold-light tracking-widest uppercase transition-colors">Select All</button>
                  <button onClick={() => selectAll(false)} className="font-mono text-xs text-white/30 hover:text-white tracking-widest uppercase transition-colors">Deselect All</button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-6 max-h-80 overflow-y-auto pr-1">
                {folderFiles.map(file => (
                  <div key={file.id} onClick={() => toggleFile(file.id)}
                    className={`relative cursor-pointer border-2 transition-colors ${file.selected ? 'border-gold' : 'border-transparent'}`}>
                    <div className="aspect-square bg-void-3 overflow-hidden">
                      {file.thumbnail_url
                        ? <img src={file.thumbnail_url} alt={file.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center">
                            {file.media_type === 'video' ? <Film size={20} className="text-gold/30" /> : <ImageIcon size={20} className="text-white/20" />}
                          </div>}
                    </div>
                    <div className="absolute top-1 right-1">
                      {file.selected
                        ? <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center"><Check size={10} className="text-void" /></div>
                        : <div className="w-5 h-5 rounded-full bg-black/60 border border-white/20" />}
                    </div>
                    {file.media_type === 'video' && (
                      <div className="absolute bottom-1 left-1"><div className="bg-gold/80 px-1 font-mono text-void text-xs">VID</div></div>
                    )}
                    <div className="p-1"><div className="font-mono text-white/30 text-xs truncate">{file.name.replace(/\.[^/.]+$/, '')}</div></div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={importSelected} disabled={selectedCount === 0 || importLoading}
                  className="bg-gold text-void font-mono text-xs px-8 py-3 tracking-widest uppercase hover:bg-gold-light transition-colors disabled:opacity-40">
                  {importLoading ? 'Importing...' : `Import ${selectedCount} File${selectedCount !== 1 ? 's' : ''}`}
                </button>
                <button onClick={() => { setFolderFiles([]); setFolderUrl(''); setFolderError(''); }}
                  className="border border-white/10 text-white/40 font-mono text-xs px-6 py-3 tracking-widest uppercase hover:border-white/30 transition-colors">
                  Clear
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* SINGLE ADD FORM */}
      {adding && (
        <div className="bg-void-2 border border-gold/30 p-6 mb-8">
          <div className="font-mono text-gold text-xs tracking-widest uppercase mb-6">Add Single Photo or Video</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="font-mono text-white/30 text-xs tracking-widest uppercase block mb-2">Title *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full bg-void border border-white/10 text-white font-mono text-sm px-4 py-3 focus:border-gold outline-none" placeholder="Studio A — Control Room" />
            </div>
            <div>
              <label className="font-mono text-white/30 text-xs tracking-widest uppercase block mb-2">Section *</label>
              <select value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))}
                className="w-full bg-void border border-white/10 text-white font-mono text-sm px-4 py-3 focus:border-gold outline-none capitalize">
                {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="font-mono text-white/30 text-xs tracking-widest uppercase block mb-2">URL (Google Drive, YouTube, or direct link) *</label>
            <input value={form.source_url} onChange={e => setForm(f => ({ ...f, source_url: e.target.value }))}
              className="w-full bg-void border border-white/10 text-white font-mono text-sm px-4 py-3 focus:border-gold outline-none"
              placeholder="https://drive.google.com/file/d/... or https://youtu.be/..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="font-mono text-white/30 text-xs tracking-widest uppercase block mb-2">Force Type</label>
              <select value={form.force_type} onChange={e => setForm(f => ({ ...f, force_type: e.target.value }))}
                className="w-full bg-void border border-white/10 text-white font-mono text-sm px-4 py-3 focus:border-gold outline-none">
                <option value="">Auto-detect</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-white/30 text-xs tracking-widest uppercase block mb-2">Alt Text</label>
              <input value={form.alt_text} onChange={e => setForm(f => ({ ...f, alt_text: e.target.value }))}
                className="w-full bg-void border border-white/10 text-white font-mono text-sm px-4 py-3 focus:border-gold outline-none" placeholder="RJV Studio session" />
            </div>
            <div>
              <label className="font-mono text-white/30 text-xs tracking-widest uppercase block mb-2">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                className="w-full bg-void border border-white/10 text-white font-mono text-sm px-4 py-3 focus:border-gold outline-none" placeholder="0" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving || !form.title || !form.source_url}
              className="bg-gold text-void font-mono text-xs px-8 py-3 tracking-widest uppercase hover:bg-gold-light transition-colors disabled:opacity-40">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setAdding(false); setForm({ ...blank }); }}
              className="border border-white/10 text-white/40 font-mono text-xs px-6 py-3 tracking-widest uppercase hover:border-white/30 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex gap-2 mr-4">
          {[['all', 'All'], ['image', 'Photos'], ['video', 'Videos']].map(([val, label]) => (
            <button key={val} onClick={() => setTypeFilter(val)}
              className={`font-mono text-xs px-4 py-2 tracking-widest uppercase transition-colors ${typeFilter === val ? 'bg-gold text-void' : 'border border-white/10 text-white/40 hover:border-gold hover:text-gold'}`}>
              {label}
            </button>
          ))}
        </div>
        {['all', ...SECTIONS].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`font-mono text-xs px-4 py-2 tracking-widest uppercase transition-colors ${filter === s ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/40'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-px bg-white/5 mb-8">
        {SECTIONS.map(s => {
          const count = media.filter(m => m.section === s).length;
          const vids = media.filter(m => m.section === s && m.media_type === 'video').length;
          return (
            <div key={s} className="bg-void-2 p-3 text-center">
              <div className="font-display text-2xl text-gold">{count}</div>
              <div className="font-mono text-white/20 text-xs tracking-widest uppercase mt-0.5">{s}</div>
              {vids > 0 && <div className="font-mono text-gold/40 text-xs mt-0.5">{vids} vid</div>}
            </div>
          );
        })}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-white/30 font-mono text-sm py-12 text-center">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-void-2 border border-white/5 p-16 text-center">
          <FolderOpen size={32} className="text-white/10 mx-auto mb-4" />
          <div className="font-mono text-white/20 text-sm">No media yet — use Bulk Import or Add One above</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(item => (
            <div key={item.id} className={`group bg-void-3 border transition-colors ${item.is_active ? 'border-white/5 hover:border-gold/30' : 'border-white/5 opacity-40'}`}>
              <MediaThumb item={item} onClick={() => setPreview(item)} />
              <div className="p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  {item.media_type === 'video' ? <Film size={10} className="text-gold shrink-0" /> : <ImageIcon size={10} className="text-gold/50 shrink-0" />}
                  <div className="font-display text-sm text-white truncate">{item.title}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-gold text-xs uppercase tracking-widest">{item.section}</span>
                  <div className="flex gap-2">
                    <button onClick={() => toggle(item)} className="text-white/30 hover:text-gold transition-colors">
                      {item.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                    <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                      <ExternalLink size={12} />
                    </a>
                    <button onClick={() => remove(item.id)} className="text-white/30 hover:text-red-400 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {preview && (
        <div className="fixed inset-0 bg-void/97 z-50 flex items-center justify-center p-6" onClick={() => setPreview(null)}>
          <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            {preview.media_type === 'video' ? (
              <div className="aspect-video w-full bg-black">
                {preview.direct_url.includes('youtube.com/embed') || preview.direct_url.includes('drive.google.com')
                  ? <iframe src={preview.direct_url} className="w-full h-full" allowFullScreen allow="autoplay" />
                  : <video src={preview.direct_url} controls autoPlay className="w-full h-full" />}
              </div>
            ) : (
              <img src={preview.direct_url} alt={preview.alt_text || preview.title} className="w-full max-h-[80vh] object-contain" />
            )}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="font-display text-xl text-white">{preview.title}</div>
                <div className="font-mono text-gold text-xs tracking-widest uppercase mt-1">{preview.section} · {preview.media_type}</div>
              </div>
              <button onClick={() => setPreview(null)} className="font-mono text-white/30 hover:text-white text-xs tracking-widest uppercase">Close ✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
