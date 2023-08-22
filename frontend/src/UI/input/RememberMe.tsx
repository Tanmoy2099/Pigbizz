import React from "react";

type Props = {
  data: {
    email: string;
    password: string;
    phone: string | number;
  };
  setData: Function
};


import { useState, useEffect } from 'react';

const RememberMe = (props: Props) => {
  const [rememberMe, setRememberMe] = useState(false);


  useEffect(() => {
    const storedRememberMe = localStorage.getItem('rememberMe');
    if (storedRememberMe) {
      props.setData(JSON.parse(storedRememberMe));
      setRememberMe(true)
    }
  }, []);

  const handleCheckboxChange = () => {
    const updatedRememberMe = !rememberMe;
    setRememberMe(updatedRememberMe);
    if (updatedRememberMe) {
      localStorage.setItem('rememberMe', JSON.stringify(props.data));
    } else {
      localStorage.removeItem('rememberMe');
    }
  };

  return (
    <div>
      <label className="label cursor-pointer flex justify-start gap-2">
        <input
          className="checkbox "
          type="checkbox"
          checked={rememberMe}
          onChange={handleCheckboxChange}
        />
        <span className="label-text text-[1.2rem]">Remember me</span>
      </label>
    </div>
  );
};

export default RememberMe;




// const RememberMe = (props: Props) => {
//   return (
//     <>
//       <label className="label cursor-pointer flex justify-start gap-2">
//         <input type="checkbox" checked={true} className="checkbox " />
//         <span className="label-text text-[1.2rem]">Remember me</span>
//       </label>
//     </>
//   );
// };

// export default RememberMe;