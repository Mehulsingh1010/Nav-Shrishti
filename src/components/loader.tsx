import React from 'react'

function loader() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-orange-50 relative">
          <svg viewBox="0 0 200 200" className="absolute w-48 h-48 animate-spin-slow">
            <path
              id="circlePath"
              fill="transparent"
              d="M 100, 100 m -90, 0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0"
            />
            <text fill="#b45309" fontSize="14" fontWeight="bold">
              <textPath xlinkHref="#circlePath" startOffset="50%">
                ॐ नमः शिवाय • हरे कृष्ण हरे राम • श्री राम जय राम जय जय राम • ॐ गं गणपतये नमः • ॐ ह्रीं क्लीं महालक्ष्म्यै नमः •
              </textPath>
            </text>
          </svg>
        </div>
      );
}

export default loader
