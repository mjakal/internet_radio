import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Radio Player',
  description: 'Internet radio player',
};

export default function Testing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
      {/* dark theme */}
      <div className="container m-4">
        <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-4">
          {/* alert */}
          <div className="hover:shodow-lg flex flex-col justify-center rounded-2xl border-gray-800 bg-gray-800 p-4 shadow-md">
            <div className="flex items-center text-gray-400">
              <Image
                className="mr-2 w-6"
                width={100}
                height={100}
                src="https://v1.tailwindcss.com/_next/static/media/tailwindcss-mark.6ea76c3b72656960a6ae5ad8b85928d0.svg"
                alt="taiwind css"
              />
              <p>
                {' '}
                A free repository for community components at{' '}
                <a
                  href="https://tailwindcomponents.com/u/aji"
                  className="hover:underline-none ml-1 text-green-300 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  tailwindcomponets
                </a>
              </p>
              <button
                type="button"
                className="ml-auto text-xs font-medium tracking-wider text-gray-400 transition duration-300 ease-in hover:text-green-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          {/* profile card */}
          <div className="sticky top-0 z-10 flex flex-col">
            <div className="rounded-2xl border border-gray-800 bg-gray-800 p-4 shadow-lg">
              <div className="flex-none sm:flex">
                <div className="relative mb-3 h-32 w-32 sm:mb-0">
                  <Image
                    src="https://tailwindcomponents.com/storage/avatars/njkIbPhyZCftc4g9XbMWwVsa7aGVPajYLRXhEeoo.jpg"
                    width={100}
                    height={100}
                    alt="aji"
                    className="h-32 w-32 rounded-2xl object-cover"
                  />
                  <a
                    href="#"
                    className="absolute -right-2 bottom-2 -ml-3 rounded-full bg-green-400 p-1 text-xs font-medium tracking-wider text-white transition duration-300 ease-in hover:bg-green-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                    </svg>
                  </a>
                </div>
                <div className="flex-auto justify-evenly sm:ml-5">
                  <div className="flex items-center justify-between sm:mt-2">
                    <div className="flex items-center">
                      <div className="flex flex-col">
                        <div className="w-full flex-none text-lg leading-none font-bold text-gray-200">
                          Aji
                        </div>
                        <div className="my-1 flex-auto text-gray-400">
                          <span className="mr-3">UI/UX Designer</span>
                          <span className="mr-3 max-h-0 border-r border-gray-600" />
                          <span>Cochin, IND</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-center">
                    <div className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5 text-yellow-400"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5 text-yellow-400"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5 text-yellow-400"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5 text-yellow-400"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-5 w-5 text-yellow-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-2 inline-flex flex-1 items-center space-x-2">
                      <a hre="https://www.behance.net/ajeeshmon" target="_blank">
                        <svg
                          className="h-5 w-5 cursor-pointer rounded-2xl p-1 transition duration-300 ease-in hover:bg-blue-500 hover:text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width={48}
                          height={48}
                          viewBox="0 0 172 172"
                          style={{ fill: '#4a90e2' }}
                        >
                          <g
                            fill="none"
                            fillRule="nonzero"
                            stroke="none"
                            strokeWidth={1}
                            strokeLinecap="butt"
                            strokeLinejoin="miter"
                            strokeMiterlimit={10}
                            strokeDasharray=""
                            strokeDashoffset={0}
                            fontFamily="none"
                            fontWeight="none"
                            fontSize="none"
                            textAnchor="none"
                            style={{ mixBlendMode: 'normal' }}
                          >
                            <path d="M0,172v-172h172v172z" fill="none" />
                            <g fill="#ffffff">
                              <path d="M71.66667,82.41667c3.58333,0 14.33333,-5.79783 14.33333,-20.13117c0,-22.28475 -19.72983,-26.45217 -41.95367,-26.45217c-4.19967,0 -17.00292,0.00717 -26.12967,0.00358c-5.93758,-0.00358 -10.75,4.81242 -10.75,10.75v78.82975c0,5.93758 4.81242,10.75 10.75,10.75h42.28333c15.83475,0 29.25792,-12.52733 29.38333,-28.36208c0.16842,-21.77233 -17.91667,-25.38792 -17.91667,-25.38792zM28.66667,53.75h25.08333c5.93758,0 10.75,4.81242 10.75,10.75c0,5.93758 -4.81242,10.75 -10.75,10.75h-25.08333zM55.54167,118.25h-26.875v-25.08333h26.875c6.92658,0 12.54167,5.61508 12.54167,12.54167c0,6.92658 -5.61508,12.54167 -12.54167,12.54167zM163.0775,103.91667c2.97058,0 5.375,-2.40442 5.37858,-5.375v0c0,-20.77975 -14.37275,-37.625 -35.83333,-37.625c-19.79075,0 -35.83333,16.84525 -35.83333,37.625c0,20.77975 16.04258,37.625 35.83333,37.625c17.51175,0 27.2405,-8.1915 31.992,-20.22075c0.91733,-2.31842 -0.8815,-4.83033 -3.3755,-4.83033h-8.60358c-1.30792,0 -2.46533,0.74175 -3.14258,1.86333c-3.27517,5.41083 -8.27392,8.85442 -15.00342,8.85442c-10.07633,0 -17.415,-7.65042 -19.2855,-17.91667h38.4205zM132.62275,75.25c7.44258,0 14.65583,5.934 16.69117,14.33333h-33.22825c2.69825,-8.41725 9.08375,-14.33333 16.53708,-14.33333zM148.70833,53.75h-28.66667c-2.967,0 -5.375,-2.408 -5.375,-5.375v0c0,-2.967 2.408,-5.375 5.375,-5.375h28.66667c2.967,0 5.375,2.408 5.375,5.375v0c0,2.967 -2.408,5.375 -5.375,5.375z" />
                            </g>
                          </g>
                        </svg>
                      </a>
                      <a hre="https://www.linkedin.com/in/ajeeshmon" target="_blank">
                        <svg
                          className="h-5 w-5 cursor-pointer rounded-2xl p-1 transition duration-300 ease-in hover:bg-blue-500 hover:text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width={30}
                          height={30}
                          viewBox="0 0 172 172"
                          style={{ fill: '#ffffff' }}
                        >
                          <g
                            fill="none"
                            fillRule="nonzero"
                            stroke="none"
                            strokeWidth={1}
                            strokeLinecap="butt"
                            strokeLinejoin="miter"
                            strokeMiterlimit={10}
                            strokeDasharray=""
                            strokeDashoffset={0}
                            fontFamily="none"
                            fontWeight="none"
                            fontSize="none"
                            textAnchor="none"
                            style={{ mixBlendMode: 'normal' }}
                          >
                            <path d="M0,172v-172h172v172z" fill="none" />
                            <g fill="#ffffff">
                              <path d="M51.6,143.33333h-28.66667v-86h28.66667zM37.2724,45.86667c-7.9292,0 -14.33907,-6.42707 -14.33907,-14.33907c0,-7.912 6.42133,-14.3276 14.33907,-14.3276c7.90053,0 14.3276,6.42707 14.3276,14.3276c0,7.912 -6.42707,14.33907 -14.3276,14.33907zM154.8,143.33333h-27.56013v-41.85333c0,-9.98173 -0.1892,-22.81867 -14.3276,-22.81867c-14.35053,0 -16.55787,10.8704 -16.55787,22.09627v42.57573h-27.5544v-86.06307h26.4536v11.75907h0.37267c3.6808,-6.76533 12.6764,-13.8976 26.0924,-13.8976c27.92133,0 33.08133,17.82493 33.08133,40.99907z" />
                            </g>
                          </g>
                        </svg>
                      </a>
                      <a hre="https://twitter.com/ajeemon?lang=en" target="_blank">
                        <svg
                          className="h-5 w-5 cursor-pointer rounded-2xl p-1 transition duration-300 ease-in hover:bg-blue-400 hover:text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width={24}
                          height={24}
                          viewBox="0 0 172 172"
                          style={{ fill: '#ffffff' }}
                        >
                          <g
                            fill="none"
                            fillRule="nonzero"
                            stroke="none"
                            strokeWidth={1}
                            strokeLinecap="butt"
                            strokeLinejoin="miter"
                            strokeMiterlimit={10}
                            strokeDasharray=""
                            strokeDashoffset={0}
                            fontFamily="none"
                            fontWeight="none"
                            fontSize="none"
                            textAnchor="none"
                            style={{ mixBlendMode: 'normal' }}
                          >
                            <path d="M0,172v-172h172v172z" fill="none" />
                            <g fill="#ffffff">
                              <path d="M155.04367,28.88883c-5.84083,2.75917 -15.781,7.9335 -20.77617,8.9225c-0.1935,0.05017 -0.35117,0.11467 -0.5375,0.16483c-5.8265,-5.74767 -13.81017,-9.3095 -22.64667,-9.3095c-17.80917,0 -32.25,14.44083 -32.25,32.25c0,0.93883 -0.07883,2.666 0,3.58333c-23.06233,0 -39.904,-12.03283 -52.51017,-27.4985c-1.68417,-2.07833 -3.47583,-0.99617 -3.8485,0.48017c-0.8385,3.33967 -1.12517,8.9225 -1.12517,12.90717c0,10.0405 7.8475,19.90183 20.06667,26.015c-2.25033,0.5805 -4.73,0.99617 -7.31,0.99617c-3.03867,0 -6.536,-0.7955 -9.59617,-2.40083c-1.13233,-0.59483 -3.57617,-0.43 -2.85233,2.46533c2.9025,11.60283 16.1465,19.75133 27.97867,22.1235c-2.6875,1.58383 -8.42083,1.26133 -11.05817,1.26133c-0.97467,0 -4.3645,-0.22933 -6.5575,-0.50167c-1.9995,-0.24367 -5.074,0.27233 -2.50117,4.171c5.5255,8.3635 18.02417,13.61667 28.78133,13.81733c-9.90433,7.76867 -26.101,10.60667 -41.61683,10.60667c-3.139,-0.07167 -2.98133,3.5045 -0.4515,4.83033c11.44517,6.00567 30.19317,9.56033 43.58767,9.56033c53.24833,0 83.51317,-40.58483 83.51317,-78.8405c0,-0.61633 -0.01433,-1.90633 -0.03583,-3.2035c0,-0.129 0.03583,-0.25083 0.03583,-0.37983c0,-0.1935 -0.05733,-0.37983 -0.05733,-0.57333c-0.0215,-0.97467 -0.043,-1.88483 -0.0645,-2.35783c4.22117,-3.04583 10.6855,-8.33483 13.9535,-12.384c1.11083,-1.376 0.215,-3.04583 -1.29717,-2.52267c-3.8915,1.3545 -10.621,3.9775 -14.835,4.47917c8.43517,-5.58283 12.60617,-10.44183 16.1895,-15.83833c1.2255,-1.84183 -0.30817,-3.71233 -2.17867,-2.82367z" />
                            </g>
                          </g>
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className="flex pt-2 text-sm text-gray-400">
                    <div className="inline-flex flex-1 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
                      </svg>
                      <p className="">1.2k Followers</p>
                    </div>
                    <div className="inline-flex flex-1 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="">14 Components</p>
                    </div>
                    <a
                      href="https://www.behance.net/ajeeshmon"
                      target="_blank"
                      className="flex-no-shrink ml-4 rounded-full border-2 border-green-300 bg-green-400 px-5 py-2 text-xs font-medium tracking-wider text-white shadow-sm transition duration-300 ease-in hover:border-green-500 hover:bg-green-500 hover:shadow-lg"
                      rel="noreferrer"
                    >
                      FOLLOW
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*-stats*/}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-4">
              <div className="relative rounded-2xl border border-gray-800 bg-gray-800 p-4 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-3 bottom-4 h-14 w-14 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                <div className="flex items-center justify-between">
                  <Image
                    className="w-7 grayscale filter"
                    width={100}
                    height={100}
                    src="https://v1.tailwindcss.com/_next/static/media/tailwindcss-mark.6ea76c3b72656960a6ae5ad8b85928d0.svg"
                    alt="taiwind css"
                  />
                </div>
                <div className="mt-5 text-2xl leading-8 font-medium text-gray-100">20</div>
                <div className="text-sm text-gray-500">Components</div>
              </div>
            </div>
            <div className="col-span-12 sm:col-span-4">
              <div className="relative rounded-2xl border border-gray-800 bg-gray-800 p-4 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-3 bottom-4 h-14 w-14 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <div className="flex items-center justify-between">
                  <i className="fab fa-behance text-xl text-gray-400" />
                </div>
                <div className="mt-5 text-2xl leading-8 font-medium text-gray-100">99</div>
                <div className="text-sm text-gray-500">Projects</div>
              </div>
            </div>
            <div className="col-span-12 sm:col-span-4">
              <div className="relative rounded-2xl border border-gray-800 bg-gray-800 p-4 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-3 bottom-4 h-14 w-14 text-yellow-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex items-center justify-between">
                  <i className="fab fa-codepen text-xl text-gray-400" />
                </div>
                <div className="mt-5 text-2xl leading-8 font-medium text-gray-100">50</div>
                <div className="text-sm text-gray-500">Pen Items</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/*confirm modal*/}
            <div className="relative flex flex-col items-center justify-center rounded-2xl border border-gray-800 bg-gray-800 p-4 shadow-lg">
              <div className="">
                <div className="flex-auto justify-center p-5 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="-m-1 mx-auto flex h-4 w-4 items-center text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto flex h-16 w-16 items-center text-gray-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h2 className="py-4 text-xl font-bold text-gray-200">Are you sure?</h2>
                  <p className="px-8 text-sm text-gray-500">
                    Do you really want to delete your account? This process cannot be undone
                  </p>
                </div>
                <div className="mt-2 space-x-4 p-3 text-center md:block">
                  <button className="mb-2 rounded-full border-2 border-gray-600 bg-gray-700 px-5 py-2 text-sm font-medium tracking-wider text-gray-300 shadow-sm transition duration-300 ease-in hover:border-gray-700 hover:bg-gray-800 hover:shadow-lg md:mb-0">
                    Cancel
                  </button>
                  <button className="ml-4 rounded-full border-2 border-green-300 bg-green-400 px-5 py-2 text-sm font-medium tracking-wider text-white shadow-sm transition duration-300 ease-in hover:border-green-500 hover:bg-green-500 hover:shadow-lg">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
            {/*elements*/}
            <div className="flex flex-col space-y-4">
              {/* elements 1 */}
              <div className="hover:shodow-lg flex transform cursor-pointer flex-col rounded-2xl border-gray-800 bg-gray-800 p-4 shadow-md transition duration-500 ease-in hover:scale-105">
                <div className="flex items-center justify-between">
                  <div className="mr-auto flex items-center">
                    <div className="inline-flex h-12 w-12">
                      <Image
                        src="https://tailwindcomponents.com/storage/avatars/njkIbPhyZCftc4g9XbMWwVsa7aGVPajYLRXhEeoo.jpg"
                        width={100}
                        height={100}
                        alt="aji"
                        className="relative h-12 w-12 rounded-2xl object-cover"
                      />
                      <span className="absolute inline-flex h-12 w-12 animate-ping rounded-2xl border-2 border-green-400 opacity-75" />
                      <span />
                    </div>
                    <div className="ml-3 flex flex-col">
                      <div className="leading-none font-medium text-gray-100">Aji</div>
                      <p className="mt-1 text-sm leading-none text-gray-500">UI/UX Designer</p>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="flex-no-shrink mr-2 text-xs font-medium tracking-wider text-gray-400 transition duration-300 ease-in hover:text-green-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    hrf="#"
                    className="flex-no-shrink ml-2 text-xs font-medium tracking-wider text-gray-400 transition duration-300 ease-in hover:text-green-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
              {/*elements 2*/}
              <div className="hover:shodow-lg flex transform cursor-pointer flex-col rounded-2xl border-gray-800 bg-gray-800 p-4 shadow-md transition duration-500 ease-in hover:scale-105">
                <div className="flex items-center justify-between">
                  <div className="mr-auto flex items-center">
                    <div className="inline-flex h-12 w-12">
                      <Image
                        src="https://tailwindcomponents.com/storage/avatars/njkIbPhyZCftc4g9XbMWwVsa7aGVPajYLRXhEeoo.jpg"
                        width={100}
                        height={100}
                        alt="aji"
                        className="relative h-12 w-12 rounded-2xl object-cover p-1"
                      />
                      <span className="absolute inline-flex h-12 w-12 rounded-2xl border-2 border-green-400 opacity-75" />
                      <span />
                    </div>
                    <div className="ml-3 flex min-w-0 flex-col">
                      <div className="leading-none font-medium text-gray-100">Groupname</div>
                      <p className="mt-1 truncate text-sm leading-none text-gray-500">
                        Beautiful hand-crafted SVG icons
                      </p>
                    </div>
                  </div>
                  <div className="ml-3 flex min-w-0 flex-col">
                    <span className="mb-1 text-right text-xs text-gray-500">9:02pm</span>
                    <div className="flex">
                      <a className="flex-no-shrink mr-2 text-xs font-medium tracking-wider text-gray-400 transition duration-300 ease-in hover:text-green-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                      <span className="ml-2 inline-flex items-center justify-center rounded-full bg-green-400 px-2 py-1 text-xs leading-none font-bold text-green-100">
                        99
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/*elements 2*/}
              <div className="hover:shodow-lg flex transform cursor-pointer flex-col rounded-2xl border-gray-800 bg-gray-800 p-4 shadow-md transition duration-500 ease-in hover:scale-105">
                <div className="flex items-center justify-between">
                  <div className="mr-auto flex items-center">
                    <div className="inline-flex h-12 w-12">
                      <Image
                        src="https://tailwindcomponents.com/storage/avatars/njkIbPhyZCftc4g9XbMWwVsa7aGVPajYLRXhEeoo.jpg"
                        width={100}
                        height={100}
                        alt="aji"
                        className="relative h-12 w-12 rounded-2xl object-cover p-1"
                      />
                      <span className="absolute inline-flex h-12 w-12 rounded-2xl border-2 border-gray-600 opacity-75" />
                      <span />
                    </div>
                    <div className="ml-3 flex min-w-0 flex-col">
                      <div className="leading-none font-medium text-gray-100">Ajimon</div>
                      <p className="mt-1 truncate text-sm leading-none text-gray-500">
                        Jul 066, 2021, 8.25 PM
                      </p>
                    </div>
                  </div>
                  <div className="ml-3 flex min-w-0 flex-col">
                    <div className="flex">
                      <h5 className="mr-2 flex items-center font-medium text-gray-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>{' '}
                        1800
                      </h5>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-2 h-6 w-6 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hover:shodow-lg flex transform cursor-pointer flex-col rounded-2xl border border-gray-800 bg-gray-800 p-4 text-gray-400 shadow-md transition duration-500 ease-in hover:scale-105 hover:text-green-500">
                <div className="flex items-center justify-between">
                  <div className="mr-auto flex items-center">
                    <div className="flex -space-x-5">
                      <Image
                        src="https://tailwindcomponents.com/storage/avatars/njkIbPhyZCftc4g9XbMWwVsa7aGVPajYLRXhEeoo.jpg"
                        width={100}
                        height={100}
                        alt="aji"
                        className="relative h-12 w-12 rounded-2xl border-2 border-gray-600 bg-gray-800 object-cover p-1"
                      />
                      <Image
                        src="https://tailwindcomponents.com/storage/avatars/njkIbPhyZCftc4g9XbMWwVsa7aGVPajYLRXhEeoo.jpg"
                        width={100}
                        height={100}
                        alt="aji"
                        className="relative h-12 w-12 rounded-2xl border-2 border-gray-600 bg-gray-800 object-cover p-1 shadow"
                      />
                    </div>
                    <div className="ml-3 flex min-w-0 flex-col">
                      <div className="leading-none font-medium text-gray-100">Pending Request </div>
                      <p className="mt-1 truncate text-sm leading-none text-gray-500">
                        Jul 066, 2021, 8.25 PM
                      </p>
                    </div>
                  </div>
                  <div className="ml-3 flex min-w-0 flex-col">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="hover:shodow-lg flex flex-col justify-center rounded-2xl border-gray-800 bg-gray-800 p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <div className="leading-none font-medium text-gray-100">
                      Delete Your Acccount?
                    </div>
                    <p className="mt-1 text-sm leading-none text-gray-500">
                      By deleting your account.
                    </p>
                  </div>
                </div>
                <a className="flex-no-shrink text-xs font-medium tracking-wider text-gray-400 transition duration-300 ease-in hover:text-green-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="hover:shodow-lg flex flex-col rounded-2xl border-gray-800 bg-gray-800 p-4 shadow-md">
              <div className="flex">
                <Image
                  src="https://images.unsplash.com/photo-1575390730294-dfc5efa5250b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
                  width={100}
                  height={100}
                  alt="Just a flower"
                  className="object-fit h-16 w-16 rounded-2xl"
                />
                <div className="flex w-full flex-col justify-center px-2 py-1">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <h2 className="leading-none font-medium text-gray-100">Massive Dynamic</h2>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 cursor-pointer text-gray-400 hover:text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </div>
                  <div className="flex pt-2 text-sm text-gray-500">
                    <div className="mr-auto flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-5 w-5 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <p className="font-normal">4.5</p>
                    </div>
                    <div className="flex items-center font-medium text-gray-300">
                      $1800
                      <span className="text-sm font-normal text-gray-600"> /wk</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="hover:shodow-lg rounded-2xl border-gray-800 bg-gray-800 p-4 shadow-md lg:w-3/5">
              <div className="flex-none lg:flex">
                <div className="mb-3 h-full w-full lg:mb-0 lg:h-36 lg:w-36">
                  <Image
                    src="https://images.unsplash.com/photo-1515362778563-6a8d0e44bc0b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
                    width={100}
                    height={100}
                    alt="unsplash images"
                    className="w-full rounded-2xl object-scale-down lg:h-36 lg:object-cover"
                  />
                </div>
                <div className="flex-auto justify-evenly py-2 lg:ml-3">
                  <div className="flex flex-col">
                    <div className="mr-auto flex items-center text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-5 w-5 text-yellow-300"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <p className="font-normal text-gray-500">4.5</p>
                    </div>
                    <div className="flex min-w-0 items-center justify-between">
                      <h2 className="mr-auto truncate text-base font-medium text-gray-100">
                        Massive Dynamic
                      </h2>
                      <div className="flex items-center font-medium text-gray-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        800
                        <span className="text-sm font-normal text-gray-500"> /Day</span>
                      </div>
                    </div>
                    <p className="flex items-center text-sm text-gray-400">
                      Fortcochi,Cochin . 7km{' '}
                      <span className="relative ml-2 inline-flex rounded-md shadow-sm">
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                        </span>
                      </span>
                    </p>
                  </div>
                  <div className="my-3 flex border-t border-gray-800" />
                  <div className="flex space-x-3 text-sm font-medium">
                    <div className="flex flex-auto items-center space-x-3 text-xs text-gray-500">
                      <span>2 Bedroom</span>
                      <span>4 Guest</span>
                    </div>
                    <button
                      className="flex-no-shrink mb-2 rounded-full border-2 border-green-300 bg-green-400 px-5 py-2 text-xs font-medium tracking-wider text-white shadow-sm transition duration-300 ease-in hover:border-green-500 hover:bg-green-500 hover:shadow-lg md:mb-0"
                      type="button"
                      aria-label="like"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-2/5 ..." />
          </div>
        </div>
      </div>
    </div>
  );
}
