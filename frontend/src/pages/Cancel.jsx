import React from 'react'

const Cancel = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-100 text-base-content">
    <div className="text-center p-10 rounded-lg shadow-lg bg-base-200">
        <h1 className="text-4xl font-bold mb-4">Payment Canceled</h1>
        <p className="text-lg">
            Your payment has been canceled. Please try again or contact support if you have any questions.
        </p>
    </div>
</div>
  )
}

export default Cancel