
import { Link } from "react-router";

export default function Failure() {
	return (
		<div className='w-full h-screen flex items-center justify-center'>
			<div className=' shadow-lg'>
				<h1 className=' text-2xl'>Authentication Failed</h1>
				<p>Sorry, we were unable to authenticate you.</p>
        <Link to={'/login'}>
          <p className=" text-white p-2 bg-green-600 m-4 rounded-xl">Click me back to login</p>
        </Link>
			</div>
		</div>
	);
}
