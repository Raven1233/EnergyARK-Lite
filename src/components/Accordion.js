import React, {useState} from 'react'

const Accordion = ({question, answer, count}) => {

  const [accordion, setAccordion] = useState(false);

  const URL_REGEX =
	/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

  const textURL = (text) => {
    const words = text.split(' ');
    return (
        words.map((word) => {
          return word.match(URL_REGEX) ? 
          <u className=' hover:text-blue-600'> 
            <a href={word} target='_blank'>{word}</a>{' '}
          </u> 
          : word + ' ';
        })
    )
  }



    
  return (
    <div className='justify-center py-2'>
        <hr class="h-px mb-4 bg-gray-200 border-0 dark:bg-gray-400 "></hr>
        <button 
            onClick={() => setAccordion(!accordion)} 
            className='flex items-center justify-between w-full'
        >
            <span className=' font-bold'>{question}</span>
            <svg
                className="fill-green-500 shrink-0 ml-8"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect
                    y="7"
                    width="16"
                    height="2"
                    rx="1"
                    className={`transform origin-center transition duration-200 ease-out ${
                    accordion && "!rotate-180"
                    }`}
                />
                <rect
                    y="7"
                    width="16"
                    height="2"
                    rx="1"
                    className={`transform origin-center rotate-90 transition duration-200 ease-out ${
                    accordion && "!rotate-180"
                    }`}
                />
        </svg>
        </button>
        <div className={`grid overflow-hidden transition-all duration-300 ease-in-out text-slate-600 text-sm
            ${accordion ? 'grid-rows-[1fr] opacity-100':'grid-rows-[0fr] opacity-0'}`}>
            <div className='overflow-hidden font-semibold'>{textURL(answer)}</div>
        </div>
        {count==3 && <hr class="h-px mt-4 bg-gray-200 border-0 dark:bg-gray-400 "></hr>}
    </div>
  )
}

export default Accordion