import { motion } from "framer-motion";

interface Props {
  message: string;
}

const ErrorState: React.FC<Props> = ({ message }) => {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-red-500 text-sm"
    >
      {message}
    </motion.p>
  );
};

export default ErrorState;