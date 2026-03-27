import React from "react";

const RegisterPage = () => {
  return (
    <div className="flex flex-col justify-center place-items-center h-full overflow-hidden">
      <form>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Register</legend>
          <label className="label">Name</label>
          <input type="name" className="input" placeholder="Name" />
          <label className="label">Email</label>
          <input type="email" className="input" placeholder="Email" />
          <label className="label">Password</label>
          <input type="password" className="input" placeholder="Password" />
          <button className="btn btn-neutral mt-4">Register</button>
        </fieldset>
      </form>
    </div>
  );
};

export default RegisterPage;
