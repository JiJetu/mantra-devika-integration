const Heading = ({ title, subtitle }) => {

  return (
    <div className="lora">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-[#4A5565]">{subtitle}</p>
    </div>
  );
};

export default Heading;