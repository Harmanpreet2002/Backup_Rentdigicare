import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import StepOne from "./Steps/Step1";
import StepTwo from "./Steps/Step2";

function EditBlog() {
  const [step, setStep] = useState(1);
  const [blogId, setBlogId] = useState("");
  const [Check, setCheck] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const selectedBlogId = searchParams.get("blogId");
    if (selectedBlogId) {
      setBlogId(selectedBlogId);
      setCheck(true);
      setStep(2);
    }
  }, [location.search, step]);

  const handleNextStep = (id) => {
    setBlogId(id);
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  return (
    <div>
      {step === 1 && <StepOne onNextStep={handleNextStep} />}
      {step === 2 && (
        <StepTwo blogId={blogId} Check={Check} onPrevStep={handlePrevStep} />
      )}
    </div>
  );
}

export default EditBlog;
