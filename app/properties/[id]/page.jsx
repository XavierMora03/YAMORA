'use client';
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { useParams, useRouter, useSearchParams, 
  usePathname
 } from "next/navigation"

const PropertyAddPage = () => {
  const router = useRouter();
  console.log('sis')
  const {id} = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const name = searchParams.get('name')
  return (
    <div>
      <button onClick={ ()=> router.push('/')} className="bg-blue-400">
        Página Principal {id} {name} {pathname}
        </button>
    </div>
  )
}

export default PropertyAddPage