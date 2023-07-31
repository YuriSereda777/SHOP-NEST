import { AiOutlineUser } from 'react-icons/ai'
import { NavLink, Outlet } from 'react-router-dom'

const ProfileLayout = () => {
  const list = [
    { id: 1, text: 'Account Info', path: '/profile/' },
    { id: 2, text: 'Address Book', path: 'address-book' },
    { id: 3, text: 'Orders', path: 'orders' },
    { id: 4, text: 'Saved Items', path: 'saved-items' },
    { id: 5, text: 'Recently Viewed', path: 'recently-viewed' },
    { id: 6, text: 'Reviews', path: 'reviews' },
    { id: 7, text: 'Vouchers', path: 'vouchers' },
  ];

  return (
    <>
      <div className='mt-12 mb-6 ml-4 flex flex-row gap-2'>
        <AiOutlineUser className='text-3xl' />
        <h3 className='text-2xl font-semibold'>Hello, Peter</h3>
      </div>
      <div className='flex flex-row gap-8'>
        <div className="w-fit flex flex-col">
          <ul className='w-fit flex flex-col text-xl font-semibold'>
            {
              list.map(listItem =>
                <NavLink key={listItem.id} to={listItem.path} 
                  className={({ isActive }) => isActive ? 'text-orange-600 transition duration-500' : 'hover:text-orange-600 transition duration-500'}>
                  <li className='py-2 px-4 cursor-pointer'>
                    {listItem.text}
                  </li>
                </NavLink>
              )
            }
          </ul>
        </div>
        <div className='grow'>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default ProfileLayout