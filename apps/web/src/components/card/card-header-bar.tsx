import Link from "next/link";
import { Breadcrumbs, BreadcrumbItem } from "@/components/nextui";
import CardHeaderBarRetitleInput from "./card-header-bar-retitle-input";

function CardHeaderBar() {
  return (
    <div className="h-8 bg-[#0E0E0E]">
      <Breadcrumbs>
        <BreadcrumbItem>
          <Link
            href="/cards"
            className="text-white opacity-60 hover:opacity-100"
          >
            筆記列表
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <CardHeaderBarRetitleInput />
        </BreadcrumbItem>
      </Breadcrumbs>
    </div>
  );
}

export default CardHeaderBar;
