import { cn } from '@/lib/utils';
import { SVGProps } from 'react';

export const FeatureIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={cn('svg-inline--fa fa-sparkles', props.className)}
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="sparkles"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      data-fa-i2svg=""
    >
      <g className="missing">
        <path
          fill="currentColor"
          d="M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"
        ></path>
        <circle fill="currentColor" cx="256" cy="364" r="28">
          <animate
            attributeType="XML"
            repeatCount="indefinite"
            dur="2s"
            attributeName="r"
            values="28;14;28;28;14;28;"
          ></animate>
          <animate
            attributeType="XML"
            repeatCount="indefinite"
            dur="2s"
            attributeName="opacity"
            values="1;0;1;1;0;1;"
          ></animate>
        </circle>
        <path
          fill="currentColor"
          opacity="1"
          d="M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"
        >
          <animate
            attributeType="XML"
            repeatCount="indefinite"
            dur="2s"
            attributeName="opacity"
            values="1;0;0;0;0;1;"
          ></animate>
        </path>
        <path
          fill="currentColor"
          opacity="0"
          d="M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"
        >
          <animate
            attributeType="XML"
            repeatCount="indefinite"
            dur="2s"
            attributeName="opacity"
            values="0;0;1;1;0;0;"
          ></animate>
        </path>
      </g>
    </svg>
  );
};

export const GoogleIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={cn('svg-inline--fa fa-google', props.className)}
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      data-fa-i2svg=""
    >
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
      ></path>
    </svg>
  );
};

export const LeafIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={cn(props.className)}
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m22 3.41-.12-1.26-1.2.4a13.84 13.84 0 0 1-6.41.64 11.87 11.87 0 0 0-6.68.9A7.23 7.23 0 0 0 3.3 9.5a9 9 0 0 0 .39 4.58 16.6 16.6 0 0 1 1.18-2.2 9.85 9.85 0 0 1 4.07-3.43 11.16 11.16 0 0 1 5.06-1A12.08 12.08 0 0 0 9.34 9.2a9.48 9.48 0 0 0-1.86 1.53 11.38 11.38 0 0 0-1.39 1.91 16.39 16.39 0 0 0-1.57 4.54A26.42 26.42 0 0 0 4 22h2a30.69 30.69 0 0 1 .59-4.32 9.25 9.25 0 0 0 4.52 1.11 11 11 0 0 0 4.28-.87C23 14.67 22 3.86 22 3.41z"></path>
    </svg>
  );
};

export const Loader2Icon = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className={cn(props.className)}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

export const XIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className={cn(props.className)}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
};

export const CircleIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className={cn(props.className)}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
};

export const GithubIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className={cn(props.className)}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
};

export const GithubBoldDuotoneIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn(props.className)}
      {...props}
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M8.854 21.57a9.9 9.9 0 0 0 6.29.001a.493.493 0 0 1-.644-.475c0-.338.013-1.413.013-2.75a2.37 2.37 0 0 0-.675-1.85c2.225-.25 4.562-1.1 4.562-4.938a3.87 3.87 0 0 0-1.025-2.687a3.6 3.6 0 0 0-.1-2.65s-.838-.275-2.75 1.025a9.43 9.43 0 0 0-5 0C7.612 5.958 6.775 6.22 6.775 6.22a3.6 3.6 0 0 0-.1 2.65a3.9 3.9 0 0 0-1.025 2.687c0 3.825 2.325 4.688 4.55 4.938a2.1 2.1 0 0 0-.638 1.337a2.137 2.137 0 0 1-2.91-.82l-.002-.005a2 2 0 0 0-1.538-1.025c-.837.013-.337.475.013.663c.451.38.803.865 1.025 1.412c.2.563.85 1.638 3.362 1.175c0 .838.013 1.625.013 1.863c0 .259-.185.551-.67.475z"
        opacity={0.5}
      ></path>
      <path
        fill="currentColor"
        d="M12 2.083c-5.523 0-10 4.477-10 10c0 4.423 2.875 8.169 6.855 9.488c.485.075.67-.216.67-.475c0-.238-.012-1.025-.012-1.863c-2.513.463-3.163-.612-3.363-1.175a3.64 3.64 0 0 0-1.025-1.412c-.35-.188-.85-.65-.013-.663a2 2 0 0 1 1.538 1.025l.003.006a2.137 2.137 0 0 0 2.91.82c.043-.51.27-.984.637-1.338c-2.225-.25-4.55-1.113-4.55-4.938a3.9 3.9 0 0 1 1.025-2.687a3.6 3.6 0 0 1 .1-2.65s.837-.263 2.75 1.025a9.43 9.43 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025c.37.838.406 1.786.1 2.65a3.87 3.87 0 0 1 1.025 2.687c0 3.838-2.338 4.688-4.562 4.938c.482.49.729 1.164.675 1.85c0 1.337-.013 2.412-.013 2.75a.493.493 0 0 0 .643.476C19.124 20.253 22 16.507 22 12.083c0-5.523-4.477-10-10-10"
      ></path>
    </svg>
  );
};

export const MinusIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
      className={cn(props.className)}
    >
      <path d="M5 12h14" />
    </svg>
  );
};

export const FaceBookBoldDuotoneIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={cn(props.className)}
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M12.683 22v-7.745h-2.607v-3.018h2.607V9.01a3.637 3.637 0 0 1 3.882-3.99a21 21 0 0 1 2.329.119v2.7h-1.599c-1.253 0-1.495.596-1.495 1.47v1.927h2.989l-.39 3.018h-2.6V22z"
        opacity={0.5}
      ></path>
      <path
        fill="currentColor"
        d="M20.999 2H2.998a1 1 0 0 0-1 1v18.001a1 1 0 0 0 1 1h18.001a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1m-2.105 5.84h-1.599c-1.253 0-1.495.596-1.495 1.47v1.926h2.989l-.39 3.019h-2.6V22h-3.116v-7.745h-2.607v-3.019h2.607V9.01a3.637 3.637 0 0 1 3.882-3.99a21 21 0 0 1 2.329.12z"
      ></path>
    </svg>
  );
};

export const InstagramTwoOneIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={cn(props.className)}
      viewBox="0 0 48 48"
    >
      <defs>
        <mask id="SVGNCk1AeEo">
          <g fill="none">
            <path
              fill="#555555"
              stroke="#fff"
              strokeLinejoin="round"
              strokeWidth={4}
              d="M34 6H14a8 8 0 0 0-8 8v20a8 8 0 0 0 8 8h20a8 8 0 0 0 8-8V14a8 8 0 0 0-8-8Z"
            ></path>
            <path
              fill="#555555"
              stroke="#fff"
              strokeLinejoin="round"
              strokeWidth={4}
              d="M24 32a8 8 0 1 0 0-16a8 8 0 0 0 0 16Z"
            ></path>
            <path fill="#fff" d="M35 15a2 2 0 1 0 0-4a2 2 0 0 0 0 4"></path>
          </g>
        </mask>
      </defs>
      <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#SVGNCk1AeEo)"></path>
    </svg>
  );
};

export const XTwitterIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={cn(props.className)}
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5 1a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h14a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4zm-.334 3.5a.75.75 0 0 0-.338 1.154l5.614 7.45l-5.915 6.345l-.044.051H6.03l4.83-5.179l3.712 4.928a.75.75 0 0 0 .337.251h4.422a.75.75 0 0 0 .336-1.154l-5.614-7.45L20.017 4.5h-2.05l-4.83 5.18l-3.714-4.928a.75.75 0 0 0-.337-.252zm10.88 13.548L6.431 5.952H8.45l9.114 12.095z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export const TiktokIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={cn(props.className)}
      viewBox="0 0 14 14"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3.657.475C4.731.355 5.852.25 7 .25s2.269.105 3.343.225a3.63 3.63 0 0 1 3.194 3.203c.115 1.069.213 2.182.213 3.322s-.098 2.253-.213 3.322a3.63 3.63 0 0 1-3.194 3.203c-1.074.12-2.195.225-3.343.225s-2.269-.105-3.343-.225a3.63 3.63 0 0 1-3.194-3.203C.348 9.253.25 8.14.25 7s.098-2.253.213-3.322A3.63 3.63 0 0 1 3.657.475m4.675 2.407a.625.625 0 0 0-1.234.141V8.8a1.552 1.552 0 1 1-1.552-1.552a.625.625 0 1 0 0-1.25A2.802 2.802 0 1 0 8.348 8.8V5.31c.6.51 1.374.79 2.282.79a.625.625 0 1 0 0-1.25c-.66 0-1.15-.204-1.511-.525c-.368-.328-.641-.816-.787-1.443"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export const LinkedinBoldDuotoneIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={cn(props.className)}
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M5.086 9.711h3.002v9.031H5.086zm1.501-1.233h-.02a1.565 1.565 0 1 1 .04-3.12a1.565 1.565 0 1 1-.02 3.12m12.325 10.264H15.91v-4.83c0-1.215-.434-2.043-1.52-2.043a1.64 1.64 0 0 0-1.54 1.098a2 2 0 0 0-.1.732v5.043h-3c0-.003.04-8.184 0-9.03h3.002v1.28a2.98 2.98 0 0 1 2.705-1.493c1.975 0 3.456 1.291 3.456 4.065v5.178z"
        opacity={0.5}
      ></path>
      <path
        fill="currentColor"
        d="M20.468 2H3.532a1.45 1.45 0 0 0-1.47 1.433v17.135c.011.8.669 1.442 1.47 1.432h16.936a1.45 1.45 0 0 0 1.47-1.432V3.433A1.45 1.45 0 0 0 20.467 2zM8.088 18.742H5.086V9.711h3.002zM6.833 8.48a2 2 0 0 1-.246-.002h-.02a1.565 1.565 0 1 1 .04-3.12a1.565 1.565 0 0 1 .226 3.122m12.079 10.262H15.91v-4.83c0-1.215-.434-2.043-1.52-2.043a1.64 1.64 0 0 0-1.54 1.098a2.1 2.1 0 0 0-.1.732v5.043h-3c0-.003.04-8.184 0-9.03h3.002v1.28a2.98 2.98 0 0 1 2.705-1.493c1.975 0 3.456 1.291 3.456 4.065v5.178z"
      ></path>
    </svg>
  );
};
