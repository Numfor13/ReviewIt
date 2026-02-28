
import {motion} from "framer-motion"
import type { HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {}

const ButtonHome: React.FC<ButtonProps> = ({children,  ...props}) => {
  return (
    <motion.button
      whileHover={{scale:1.25}}
      whileTap={{scale: 0.95}}
      {...props}
      >
        {children}
      </motion.button>
  );
};


const ButtonAuth: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      {...props}
      className={`w-full bg-green-800 text-white p-3 rounded-lg font-semibold hover:bg-green-900 transition ${props.className}`}
    >
      {children}
    </motion.button>
  );
};

export {ButtonHome, ButtonAuth};
