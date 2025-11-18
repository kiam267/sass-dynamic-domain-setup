import {
  addDomainToVercel,
  getDomainFromVercel,
} from '@/lib/vercel';
import Image from 'next/image';

export default async function Home() {
  // const lg = await addDomainToVercel(
  //   'shariarkobirkiam.xyz'
  // );
  const gt = await getDomainFromVercel(
    'shariarkobirkiam.xyz'
  );
  console.log(gt);

  return <div>HI</div>;
}
