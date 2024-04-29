import { Fragment } from "react";
import { FaCheck } from "react-icons/fa";
import { Metadata } from "next";
import Footer from "@/components/footer";
import Header from "@/components/header";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  CardFooter,
  Button,
} from "@/components/nextui";

const priceList = [
  {
    name: "Free",
    price: "0",
    unit: "TWD",
    period: "mo",
    features: [
      "完整功能使用",
      "無限空間",
      "無限筆記",
      "社群支援",
      "支援無限人同時協作",
      "1GB 雲端空間",
    ],
    description: "免費使用",
    subscription: "目前方案",
  },
  {
    name: "贊助者方案",
    price: "150",
    unit: "TWD",
    period: "mo",
    features: [
      "完整功能使用",
      "無限空間",
      "無限筆記",
      "社群支援",
      "支援無限人同時協作",
      "讓貓貓陪你寫筆記",
      "10 GB 雲端空間",
    ],
    description: "每個月一杯咖啡的價格，協助平台走得更遠",
    subscription: "Coming soon",
  },
];

export const metadata: Metadata = {
  title: "Pricing | Ziphus",
};

export default function Page(): JSX.Element {
  return (
    <div className="min-w-screen h-full min-h-screen w-full bg-black ">
      <Header />
      <main className=" container mx-auto mb-96 flex flex-col items-center py-4">
        <p className="text-md z-10 mt-2 text-zinc-400">
          雖然服務是免費的，但是開發者的伺服器跟貓貓的費用不是
        </p>
        <p className="text-md z-10 mt-2 text-zinc-400">
          花一杯咖啡的錢，支持這項專案繼續維護與開發
        </p>
        <div className="mt-24 flex items-center justify-center gap-12">
          {priceList.map((price) => (
            <Card
              key={price.name}
              className="min-h-[48rem] w-full min-w-[24rem] p-8"
            >
              <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
                <h1 className="text-lg font-bold uppercase">{price.name}</h1>
                <h2 className="mt-6 flex justify-center gap-1 text-7xl font-normal">
                  <span className="mt-2 text-3xl">$</span> {price.price}
                  <span className="self-end text-xl">
                    {price.unit}/{price.period}
                  </span>
                </h2>
              </CardHeader>
              <Divider className="my-4" />
              <CardBody className="overflow-visible py-2">
                <p className="mb-4">
                  {price.description.split("\n").map((line) => (
                    <Fragment key={line}>
                      {line}
                      <br />
                    </Fragment>
                  ))}
                </p>
                <ul className="text-default-500">
                  {price.features.map((feature) => (
                    <li className="my-2 flex items-center gap-2" key={feature}>
                      <span className="rounded-full border border-white/20 bg-white/20 p-1">
                        <FaCheck />
                      </span>
                      <span>
                        {feature.split("\n").map((line) => (
                          <Fragment key={line}>
                            {line}
                            <br />
                          </Fragment>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardBody>
              <CardFooter className="flex items-center justify-center">
                <Button size="lg" className="w-full" isDisabled={true}>
                  {price.subscription}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
