import React from 'react'
import { useState } from 'react'
import { DocumentTextIcon, NewspaperIcon, BuildingOffice2Icon, HomeIcon, Cog8ToothIcon, QuestionMarkCircleIcon, Bars3Icon} from '@heroicons/react/24/solid'
function Navbar() {

  const [menuCollapse, setMenuCollapse] = useState(false); // State of Menu Collapse
  const [selected, isSelected] = useState("Dashboard"); // State of Selected Menu Item
  return (
    /* This is the sidebar that is collapsed and expanded */
    /*Main div*/
    <div className={`bg-slate-100 h-screen ${menuCollapse ? 'w-20' : 'w-80'} duration-500`}>
      <div className='py-5 px-5 '>
        <div className='p-2 h-10 w-10 rounded-3xl hover:bg-green-300 cursor-pointer'>
          <Bars3Icon 
            className='h-6 w-6 text-gray-800' 
            onClick={() => setMenuCollapse(!menuCollapse)} 
          />
        </div>
      </div>
      <div className='space-y-10'>
        <div className={`px-10 duration-500 ${menuCollapse && 'px-3'}`}>
          <div className='text-center duration-500'>
            {/* Changing the title energyARK! to eA! on menu collapse*/}
            {!menuCollapse ? <h1 className='text-4xl text-gray-800 duration-500'>energyARK!</h1> :  <h1 className='text-4xl text-gray-800 duration-500'>eA!</h1>}
          </div>
          <div className='text-center duration-500'>
            <h3 className='text-xl text-green-300 duration-500'>Admin</h3>
          </div>
        </div>
        <div className={`px-10 space-y-4 ${menuCollapse && 'space-y-0 px-2'} duration-500`}>
          <div className=''>
              <div className={`${menuCollapse && 'scale-0'}`}>
                <h2 className={`text-2xl text-gray-700 ${menuCollapse && 'scale-0'} duration-500`}>Ubersicht</h2>
              </div>
              <div className={`flex flex-col space-y-2 `}>
                <div className={`py-3 px-5 space-x-4 flex justify-start cursor-pointer rounded-xl hover:bg-green-200 items-center ${menuCollapse && 'px-1 hover:bg-transparent'} duration-500`}>
                  <div>
                    <DocumentTextIcon className={`${!menuCollapse ? "text-gray-500 h-8 w-8 " : "h-6 w-6 "} duration-500`}/>
                  </div>
                  <div>
                    <p className={`text-xl text-gray-500 hover:text-gray-800 ${menuCollapse && 'scale-0'} duration-500`}>Startseite</p>
                  </div>
                </div>
                <div className={`py-3 px-5 space-x-4 flex justify-start cursor-pointer rounded-xl hover:bg-green-200 items-center ${menuCollapse && 'px-1 hover:bg-transparent'} duration-500`}>
                  <div>
                    <NewspaperIcon className={`${!menuCollapse ? "text-gray-500 h-8 w-8 " : "h-6 w-6 "} duration-500`}/>
                  </div>
                  <div>
                    <p className={`text-xl text-gray-500 $ hover:text-gray-800 ${menuCollapse && 'scale-0'} duration-500`}>Dashboard</p>
                  </div>
                </div>
              </div>
          </div>
          <div className=''>
              <div className={`${menuCollapse && 'scale-0'}`}>
                <h2 className={`text-2xl text-gray-700 ${menuCollapse && 'scale-0'} duration-500`}>Daten</h2>
              </div>
              <div className='flex flex-col space-y-2'>
                <div className={`py-3 px-5 space-x-4 flex justify-start cursor-pointer rounded-xl hover:bg-green-200 items-center ${menuCollapse && 'px-1 hover:bg-transparent'} duration-500`}>
                  <div>
                    <BuildingOffice2Icon className={`${!menuCollapse ? "text-gray-500 h-8 w-8 " : "h-6 w-6 "} duration-500`}/>
                  </div>
                  <div>
                    <p className={`text-xl text-gray-500 hover:text-gray-800 ${menuCollapse && 'scale-0'} duration-500`}>Gebaudeliste</p>
                  </div>
                </div>
                <div className={`py-3 px-5 space-x-4 flex justify-start cursor-pointer rounded-xl hover:bg-green-200 items-center ${menuCollapse && 'px-1 hover:bg-transparent'} duration-500`}>
                  <div>
                    <HomeIcon className={`${!menuCollapse ? "text-gray-500 h-8 w-8 " : "h-6 w-6 "} duration-500`}/>
                  </div>
                  <div>
                    <p className={`text-xl text-gray-500 hover:text-gray-800 ${menuCollapse && 'scale-0'} duration-500`}>Gebaudedetails</p>
                  </div>
                </div>
              </div>
          </div>
          <div className=''>
              <div className={` ${menuCollapse && 'scale-0'}`}>
                <h2 className={`text-2xl text-gray-700 ${menuCollapse && 'scale-0'} duration-500`}>Weitere</h2>
              </div>
              <div className='flex flex-col space-y-2'>
                <div className={`py-3 px-5 space-x-4 flex justify-start cursor-pointer rounded-xl hover:bg-green-200 items-center ${menuCollapse && 'px-1 hover:bg-transparent'} duration-500`}>
                  <div>
                    <Cog8ToothIcon className={`${!menuCollapse ? "text-gray-500 h-8 w-8 " : "h-6 w-6 "} duration-500`}/>
                  </div>
                  <div>
                    <p className={`text-xl text-gray-500 hover:text-gray-800 ${menuCollapse && 'scale-0'} duration-500`}>Settings</p>
                  </div>
                </div>
                <div className={`py-3 px-5 space-x-4 flex justify-start cursor-pointer rounded-xl hover:bg-green-200 items-center ${menuCollapse && 'px-1 hover:bg-transparent'} duration-500`}>
                  <div>
                    <QuestionMarkCircleIcon className={`${!menuCollapse ? "text-gray-500 h-8 w-8 " : "h-6 w-6 "} duration-500`}/>
                  </div>
                  <div>
                    <p className={`text-xl text-gray-500 hover:text-gray-800 ${menuCollapse && 'scale-0'} duration-500`}>FAQ</p>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Navbar