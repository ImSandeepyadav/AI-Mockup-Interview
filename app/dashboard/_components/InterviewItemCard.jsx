import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

function InterviewItemCard({ interview }) {
  const router = useRouter()

  const onStart = () => {
    router.push('/dashboard/interview/' + interview?.mockId)
  }

  const onFeedbackPress = () => {
    router.push('/dashboard/interview/' + interview?.mockId + '/feedback')
  }

  return (
    <div className='rounded-xl shadow-lg p-5 bg-gradient-to-br from-white via-blue-50 to-indigo-100 transition-transform duration-300 hover:shadow-2xl hover:scale-[1.02]'>
      <h2 className='font-bold text-xl text-indigo-700 mb-2'>
        {interview?.jobPosition}
      </h2>
      <p className='text-sm text-gray-600'>
        {interview?.jobExperience} years of experience
      </p>
      <p className='text-xs text-gray-500 mt-1'>
        Created At: {interview?.createdAt}
      </p>
      <div className='flex justify-between gap-3 mt-5'>
        <Button
          size='sm'
          variant='outline'
          className='flex-1 rounded-full border-indigo-500 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-600'
          onClick={onFeedbackPress}
        >
          Feedback
        </Button>
        <Button
          size='sm'
          className='flex-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-md'
          onClick={onStart}
        >
          Start
        </Button>
      </div>
    </div>
  )
}

export default InterviewItemCard