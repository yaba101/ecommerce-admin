import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'


const SetUpPage = () => {
  return (
     <div className="h-screen p-4">
      <UserButton afterSignOutUrl='/' />
    </div>
  )
}

export default SetUpPage