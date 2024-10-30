'use client'
import { useSearchParams } from 'next/navigation'
import FormBuilder from '@/components/FormBuilder';
const DashboardPage = () => {
  const searchParams = useSearchParams()
  const name = searchParams.get('userName')
  return (
    <div className=' flex-col h-screen'>
      <div className='flex'><FormBuilder/></div>

    </div>
  );
};


export default DashboardPage;