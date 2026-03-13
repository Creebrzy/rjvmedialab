import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';

const gallery = [
  { src: 'https://lh3.googleusercontent.com/sitesv/APaQ0SQIirnac15JXsXtcKw4yeJvVH_wvP3zgtYZqZ6zw_yPV9EHJncNQvRjD2bpMUfBLX-aiOZyGBo0SrgR1DTYRHIWT9w9OUBRNbAlcurwK9N2zsAS52dQpobhh7QLWk6dG0g867r4Ml8Wa9yo0jEAz8FtSTDSuvL6TkANJaI_Xp8eJY1PM4y3ZTx2=w1280', label: 'Studio A', span: 'col-span-2 row-span-2' },
  { src: 'https://lh3.googleusercontent.com/sitesv/APaQ0STo0M4Lsol20UWmoAXFOtICgWFFCfU9SyZX2E0qSkfo-KoaSKQwBS623-56aWRMHeGX7DtL1o7iuZsTJj6Zw4uTZi2izTGW8-QA0f90vMaIEv0Gfy8N-mgsmvwk-j97cA_deg6Vy8FOdStflkKn0Hqmv09hEc7ieg4FMabFRovJRIKBDzdnmxShuh46H3UY1YbDNYZXagfYt0jM-AO0sqOrwwfTy-0lQqSl108=w800', label: 'The Morning Aux', span: '' },
  { src: 'https://lh3.googleusercontent.com/sitesv/APaQ0SQjwViGvE-66q5kgb8MtFZNQ_q_vG698BmtX7z_s1zyui6qOl97mmd9CQj5GGRN_XnXnmiSICz3d4Wamkivvw1zn2ly4DfpE4gm-o6ztJKl8MZYFgvGPTehvLNOf52sTspVcGdozhrL0fg4a7CE4aZQQPz6CjwJBjNHBDyMJn89jZ9yE6F3qV-axygkF_Gi8_ftsFkQGHkxLe0oFay3Fd55Dk1GvWqtS8D-=w800', label: 'Talk Vibe Hustle', span: '' },
  { src: 'https://lh3.googleusercontent.com/sitesv/APaQ0SQCiPeTjefaRGGGW58O90FwqbB1C5Ep0iBH14gAwJbc7IJFk9OvEymgV999TcZhSgJz29z5NFxWkeKz3-GDz3zE3GgS_PPuvMzz3IhvHo-DOX__D_mLwafbWVtx01aVS8qh2Cpr8w4NJoke-OGENqtfyKzeTc3yJkZFU6V3CxkNkNeNL50wNw1FMc8CYAKkZG8ObNJGia_RI0Qyjw_PtyFoHi4FsvnZ6Hgo=w1280', label: 'Production Floor', span: 'col-span-2' },
  { src: 'https://lh3.googleusercontent.com/sitesv/APaQ0SRySuKsGayMA3d7XpTGz5y9xrroZ3-Qb75Ozl83n1RMdwldjYA6GSlZxlc6bGhT7-0eqRKYdj_k8DDD0qwxg6BQtPV9v-mk2dUwsMle87lUCAjSPpzHsl2xD6hUCSOlsNloFNOJam7gdJ_DpEpmo-09G6aq8ZVMpNzHw8YTEVbOjOHKJC3A43Y0O-stYsK30dDMYUJA_XylyRQ8f_56O_HuzyF32A9s2w5tXhs=w800', label: 'Jvngle Green Room', span: '' },
  { src: 'https://lh3.googleusercontent.com/sitesv/APaQ0SSIici7O4pXiSGruSURg_5gtlVY_MFbxGyQmqO9-ErdD21sOINxAFAFzhU0H1uVF8FouE68WglF_uK-qn8IzvQR3YnRaANCOKM33XiAIuCEKNPy6XiR5VoDWw1FHnImxNxLgf9ncI4Dwmn-ilChx3JoxWWH_1sPGYQVGH9OpDFBpsbx-ApFVpwYohKuDyfLIokXl2q0pLO7x_hZY9V22jUITuj5oZtZ6qlFjMg=w800', label: 'Sound Fader Inc.', span: '' },
  { src: 'https://lh3.googleusercontent.com/sitesv/APaQ0SS1serhLz2aIUMtAZZFZwnY0q_6kONK5slpxiM6J0Ch3hiScuZI4oD0Y2LN4u1CaM2LxA4Orej8FBl_efrAFZbCabeqyM7P9DCwP4kYlHdeKDQvKVmBoci_pX12DR8f-Frfi8PXsiuYVs38S7HDuU_6oJRU2H4C3DenOgZBRXocUmFRxs642gnGdWK9yIhZozlUNlsnrxLLCtsIqQyZir18ZpmZSw4Pfjny8B4=w800', label: 'Good Omen Studios', span: '' },
  { src: 'https://lh3.googleusercontent.com/sitesv/APaQ0SSGIlVvt5WKnL-E_T-KFlxsYoHUy_KhTYLCG5NO8cd4QkkvpAR5CJgDMpXXxszSkQW7ZDUXI6rXZhkjJAiI_5CcUveEYQKtkI3JbizI5O0dEUGCXvPXhN7ETSVahmcapGaliHiOYnUXtgH-K--RgnNXN69ksyS3_3KvxF2ihzdmAfjgEVncoO9u1Prv_8MQNRWS_2aP5i1qhQZoBN-U0ABTdqqBiqS0PsWf=w1280', label: 'Sessions', span: 'col-span-2' },
  { src: 'https://lh3.googleusercontent.com/sitesv/APaQ0SRCav1b65H2XzBQQGaLDcYrzHsJjRG2smRr_L206i_4rOZnI-l0KjZoEc69YPtXCI6mk4zLxW7bN6kJAdvTnRFUqdhCfJu_yE5P2Hbum9EGjrurOx3JGx59TWt4dYQ3Eoq8wVQvJAVY4grDCxhR1wC02A1eraUbKlFjXD5xaqTaTKsGGGTZUAvmruhchhL5E3Ppg1muOc5TWlYSV1UvDO5WbWlBxG79SBgzx80=w800', label: 'The Team', span: '' },
  { src: 'https://lh3.googleusercontent.com/sitesv/APaQ0STbvtlkr5Xhq0MNDj6RU7exlyx9q2qdngOOwnf-GOELPT8P36cU7gdcUk1G83aA3ccaCeGNra6tmqwdhnokGykAI-jmi8AUrR2dLozcFEpC51chJvTHvLNOf52sTspVcGdozhrL0fg4a7CE4aZQQPz6CjwJBjNHBDyMJn89jZ9yE6F3qV-axygkF_Gi8_ftsFkQGHkxLe0oFay3Fd55Dk1GvWqtS8D-=w800', label: 'Kuttin Up', span: '' },
];

export default function GalleryPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="gold-line mb-6" />
          <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-none text-white mb-16">
            THE<br /><span className="text-gold">GALLERY</span>
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 auto-rows-[240px]">
            {gallery.map((item) => (
              <div key={item.label} className={`group relative overflow-hidden ${item.span}`}>
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="font-display text-xl text-white">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
