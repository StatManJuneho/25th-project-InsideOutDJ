import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";

import tw from "tailwind-styled-components";

const MarqueeWall = ({
    bg_100,
    text_300,
    text_400,
    text_600,
    text_800
  }) => {

    return (
        <div>
            <div
              className="w-full h-full absolute bg-gradient-to-b from-transparent from-30% to-slate-50 to-85% z-30 opacity-80"
              style={{ pointerEvents: "none" }}
            ></div>
            <div className={bg_100}>
              <div className="max-h-[600px] w-full overflow-hidden z-20">
                <div className={text_800}>
                  <Marquee
                    speed={15}
                    pauseOnHover={true}
                    className="text-8xl font-black italic mt-3 mb-2 subpixel-antialiased drop-shadow-[0_4px_4px_rgb(45, 212, 191)]"
                  >
                    #나의추천노래 #InsideOutDJ #YBIGTA-신입프로젝트&nbsp;
                  </Marquee>
                </div>
                <div className={text_600}>
                  <Marquee
                    speed={35}
                    pauseOnHover={true}
                    className="text-8xl font-black italic mt-2 tb-2 subpixel-antialiased drop-shadow-[0_4px_4px_rgb(45, 212, 191)]"
                  >
                    #감성 #스트리밍 #스포티파이 #내플레이리스트 #음악
                    #플레이어&nbsp;
                  </Marquee>
                </div>
                <div className={text_600}>
                  <Marquee
                    speed={35}
                    pauseOnHover={true}
                    className="text-8xl font-black italic mt-2 tb-3 subpixel-antialiased drop-shadow-[0_4px_4px_rgb(45, 212, 191)]"
                  >
                    #평온 #희망 #노스탤지어 #외로움 #우울 #기쁨 #그리움 #화남
                    #열정 #흥분 #감동 #행복 #슬픔 #만족 #설렘 #두려움&nbsp;
                  </Marquee>
                </div>
                <div className={text_400}>
                  <Marquee
                    speed={25}
                    pauseOnHover={true}
                    className="text-6xl font-bold italic mt-3 tb-2 subpixel-antialiased drop-shadow-[0_4px_4px_rgb(45, 212, 191)]"
                  >
                    #기쁨 #슬픔 #흥분 #평온 #노스탤지어 #열정 #그리움 #만족
                    #외로움 #감동 #우울 #희망 #두려움 #화남 #행복 #설렘&nbsp;
                  </Marquee>
                </div>
                <div className={text_300}>
                  <Marquee
                    speed={25}
                    pauseOnHover={true}
                    className="text-6xl font-bold italic mt-3 tb-2 subpixel-antialiased drop-shadow-[0_4px_4px_rgb(45, 212, 191)]"
                  >
                    #외로움 #감동 #우울 #희망 #두려움 #화남 #행복 #설렘 #기쁨
                    #슬픔 #흥분 #평온 #노스탤지어 #열정 #그리움 #만족 &nbsp;
                  </Marquee>
                </div>
              </div>
            </div>
        </div>
    );
  }

export default MarqueeWall