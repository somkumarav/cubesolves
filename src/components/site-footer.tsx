import { FaGithub, FaDonate, FaDiscord, FaCodeBranch } from "react-icons/fa";

export const Footer: React.FC = () => {
  const footerItemClassName =
    "text-footer-inactive hover:text-footer flex items-center justify-center gap-2 text-sm font-medium transition-colors";
  return (
    <div className='flex h-[5vh] w-full justify-center gap-[75px]'>
      <a
        href='https://github.com/somkumarav/cubeSolve'
        target='_blank'
        rel='noreferrer'
        className={footerItemClassName}
      >
        <FaGithub className='footer-item-icon' />
        <h4>Github</h4>
      </a>
      <a
        href='https://github.com/somkumarav/cubeSolve'
        target='_blank'
        rel='noreferrer'
        className={footerItemClassName}
      >
        <FaDonate className='footer-item-icon' />
        <h4>Donate</h4>
      </a>
      <a
        href='https://github.com/somkumarav/cubeSolve'
        target='_blank'
        rel='noreferrer'
        className={footerItemClassName}
      >
        <FaDiscord className='footer-item-icon' />
        <h4>Discord</h4>
      </a>
      <div
        // className="footer-item no-hover"
        className={footerItemClassName}
      >
        <FaCodeBranch className='footer-item-icon' />
        <h4>1.0.0</h4>
      </div>
    </div>
  );
};
