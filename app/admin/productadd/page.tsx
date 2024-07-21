import ProductUploadForm from '@/components/ProductForm';
import Head from 'next/head';


const ProductUploadPage: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Product Upload</title>
      </Head>
      <main className='flex flex-col items-center justify-center min-h-screen py-2'>
        <ProductUploadForm />
      </main>
    </div>
  );
};

export default ProductUploadPage;