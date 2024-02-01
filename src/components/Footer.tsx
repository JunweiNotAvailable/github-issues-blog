import Image from "next/image";

const Footer = () => {
  return (
    <footer className="flex items-center justify-center py-2 border-t">
      <div className="flex items-center">Copyright 2024 <Image className="ml-2" src={'/logo.png'} alt="" height={12} width={12} /><span className="font-logo">DanielIssues</span></div>
    </footer>
  );
}
 
export default Footer;