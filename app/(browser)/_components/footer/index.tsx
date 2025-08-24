import React from "react";
import Logo from "../navbar/Logo";
import {
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Twitch,
  Twitter,
  Youtube,
} from "lucide-react";

const Footer = () => {
  return (
    <div className="w-full">
      <div className="mt-3 grid grid-cols-2 lg:grid-cols-1">
        <div>
          <Logo />
          <div className="mt-3 space-y-2">
            <div className="flex items-center">
              <MapPin size={19} />
              <p className="text-xs">Jakarta, Indonesia</p>
            </div>
            <div className="flex items-center">
              <MapPin size={19} />
              <p className="text-xs">Karawang, Indonesia</p>
            </div>
          </div>
        </div>
        <div className="lg:mt-7">
          <h3 className="text-sm font-medium">Contact Us :</h3>
          <div className="flex gap-x-2 mt-3">
            <Instagram />
            <Facebook />
            <Linkedin />
            <Twitch />
          </div>
        </div>
      </div>
      <div className="text-center pb-3 pt-10">
        <p className="text-sm font-secondary tracking-wide">shoesstore 2025</p>
      </div>
    </div>
  );
};

export default Footer;
