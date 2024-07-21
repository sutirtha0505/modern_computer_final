import ProductTable from '@/components/ProductTable';
import Head from 'next/head';


const ProductTablePage: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Product Table</title>
      </Head>
      <main className='flex flex-col items-center justify-center pt-16'>
        <ProductTable />
      </main>
    </div>
  );
};

export default ProductTablePage;