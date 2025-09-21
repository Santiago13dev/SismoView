import dynamic from 'next/dynamic';
import Loading from './Loading';

const Globe = dynamic(() => import('./Globe'), {
  loading: () => <Loading text="Cargando visualización 3D..." />,
  ssr: false,
});

export default Globe;