'use client'
import { ClipLoader } from "react-spinners";

const override = {
  display: 'block',
  margin: '100px auto'
}
const LoadingPage = () => {
  return <ClipLoader color="#3b82f6" cssOverride={override} size={150} aria-label='LoadingSpinner'/>
};

export default LoadingPage;
