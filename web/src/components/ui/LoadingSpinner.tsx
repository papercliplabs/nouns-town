import { cn } from "@/utils/shadcn";

export interface LoadingSpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({ size = 24, className, ...props }: LoadingSpinnerProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("animate-spin", className)}
    >
      <path
        opacity="0.2"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.5 19.5C13.4193 19.5 14.3295 19.3189 15.1788 18.9672C16.0281 18.6154 16.7997 18.0998 17.4497 17.4497C18.0998 16.7997 18.6154 16.0281 18.9672 15.1788C19.3189 14.3295 19.5 13.4193 19.5 12.5C19.5 11.5807 19.3189 10.6705 18.9672 9.82122C18.6154 8.97194 18.0998 8.20026 17.4497 7.55025C16.7997 6.90024 16.0281 6.38463 15.1788 6.03284C14.3295 5.68106 13.4193 5.5 12.5 5.5C10.6435 5.5 8.86301 6.2375 7.55025 7.55025C6.2375 8.86301 5.5 10.6435 5.5 12.5C5.5 14.3565 6.2375 16.137 7.55025 17.4497C8.86301 18.7625 10.6435 19.5 12.5 19.5ZM12.5 22.5C18.023 22.5 22.5 18.023 22.5 12.5C22.5 6.977 18.023 2.5 12.5 2.5C6.977 2.5 2.5 6.977 2.5 12.5C2.5 18.023 6.977 22.5 12.5 22.5Z"
        fill="#525252"
      />
      <path
        d="M2.5 12.5C2.5 6.977 6.977 2.5 12.5 2.5V5.5C10.6435 5.5 8.86301 6.2375 7.55025 7.55025C6.2375 8.86301 5.5 10.6435 5.5 12.5H2.5Z"
        fill="#525252"
      />
    </svg>
  );
};
