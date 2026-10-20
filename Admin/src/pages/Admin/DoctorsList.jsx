import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (aToken) getAllDoctors()
  }, [aToken])

  const list = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.speciality.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className='w-full max-w-6xl'>
      {/* Header + search */}
      <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-800'>Doctors List</h1>
          <p className='text-sm text-gray-500 mt-1'>{doctors.length} doctors registered</p>
        </div>

        <div className='flex items-center gap-2 bg-white border border-gray-200 focus-within:border-[#5F6FFF] focus-within:ring-4 focus-within:ring-indigo-100 rounded-full px-4 py-2 sm:w-72 transition-all'>
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#9CA3AF' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <circle cx='11' cy='11' r='8' />
            <path d='m21 21-4.3-4.3' />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search by name or speciality...'
            className='w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400'
          />
        </div>
      </div>

      {/* Doctor cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {list.map((doc) => (
          <div
            key={doc._id}
            className='group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300'
          >
            <div className='bg-indigo-50 group-hover:bg-[#5F6FFF] transition-colors duration-300'>
              <img src={doc.image} alt={doc.name} className='w-full h-48 object-cover object-top' />
            </div>

            <div className='p-4'>
              <p className='text-gray-800 font-semibold truncate'>{doc.name}</p>
              <p className='text-sm text-gray-500'>{doc.speciality}</p>

              <div className='flex items-center justify-between mt-4'>
                <label className='flex items-center gap-2 cursor-pointer select-none'>
                  <input
                    type='checkbox'
                    checked={doc.available}
                    onChange={() => changeAvailability(doc._id)}
                    className='sr-only peer'
                  />
                  <span className='relative w-9 h-5 bg-gray-300 peer-checked:bg-emerald-500 rounded-full transition-colors after:content-[""] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-4' />
                  <span className={`text-xs font-medium ${doc.available ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {doc.available ? 'Available' : 'Unavailable'}
                  </span>
                </label>

                <span className='text-xs text-gray-500'>Rs {doc.fees}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {list.length === 0 && (
        <div className='bg-white border border-gray-200 rounded-2xl py-14 text-center mt-2'>
          <p className='text-gray-700 font-medium'>No doctors found</p>
          <p className='text-sm text-gray-500 mt-1'>Add a doctor or try a different search.</p>
        </div>
      )}
    </div>
  )
}

export default DoctorsList