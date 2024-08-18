"use client";

import { FaThreads } from "react-icons/fa6";
import { LuCopyPlus, LuCopyMinus } from "react-icons/lu";
import {
  MdDarkMode,
  MdLightMode,
  MdArrowBackIosNew,
  MdOutlineCheck,
  MdOutlineMoreHoriz,
  MdOutlineSettingsInputComponent,
} from "react-icons/md";
import { TbRouteSquare2 } from "react-icons/tb";
import { useRouter } from "next/navigation";
import {
  Button,
  Dropdown,
  useDisclosure,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "../nextui";
import useCreateCard from "@/hooks/card/useCreateCard";
import { fetchDeleteCardTitle } from "@/hooks/card/useDeleteCard";
import useCreateSpaceCardCase from "@/hooks/space/useCreateSpaceCardCase";
import useDeleteSpaceCard from "@/hooks/space/useDeleteSpaceCardCase";
import useMobileFocusSpaceCard from "@/hooks/space/useMobileFocusSpaceCard";
import useMobileInfiniteScrollMode from "@/hooks/space/useMobileInfiniteScrollMode";
import useMobileIsEditing from "@/hooks/space/useMobileIsEditing";
import useMobileMindMap from "@/hooks/space/useMobileMindMap";
import useSpaceStore from "@/stores/useSpaceStore";
import useThemeStore from "@/stores/useThemeStore";
import SpaceHeaderBarRetitleInput from "./space-header-bar-retitle-input";

function MobileSpaceHeaderBarTouchActionModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              滑動方向設定
            </ModalHeader>
            <ModalBody>這個部分還在開發中，敬請期待！</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function MobileSpaceHeaderBarMoreButton() {
  const [theme, toggleTheme] = useThemeStore((state) => [
    state.theme,
    state.toggleTheme,
  ]);
  const { isOpen: isTextModalOpen, onOpenChange: onTextModalOpenChange } =
    useDisclosure();
  //* 新增卡片
  const spaceId = useSpaceStore((state) => state.id);
  const { goTargetSpaceCard, focusSpaceCard, goNextSpaceCard } =
    useMobileFocusSpaceCard();
  const mutateCreateCard = useCreateCard();
  const mutateCreateSpaceCard = useCreateSpaceCardCase();
  const mutateDeleteSpaceCard = useDeleteSpaceCard();
  const { isInfiniteScrollMode, toggleInfiniteScrollMode } =
    useMobileInfiniteScrollMode();
  const { isMindMapOpen, toggleIsMindMapOpen } = useMobileMindMap();
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="light" className=" text-lg">
            <MdOutlineMoreHoriz />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem
            key="theme"
            onClick={toggleTheme}
            startContent={theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
          >
            <div className="flex items-center gap-2">
              {theme === "dark" ? "切換至淺色模式" : "切換至深色模式"}
            </div>
          </DropdownItem>
          <DropdownItem
            key="create-card"
            onClick={async () => {
              const cardData = await mutateCreateCard.mutateAsync(undefined);
              const spaceCardData = await mutateCreateSpaceCard.mutateAsync({
                spaceId: spaceId,
                targetCardId: cardData.data.card.id,
                x: 0,
                y: 0,
              });
              goTargetSpaceCard(spaceCardData.data.spaceCard.id);
            }}
            startContent={<LuCopyPlus />}
          >
            <div className="flex items-center gap-2">新增空白卡片</div>
          </DropdownItem>
          <DropdownItem
            key="delete-card"
            color="danger"
            className="text-red-500"
            onClick={async () => {
              if (!focusSpaceCard) return;
              await mutateDeleteSpaceCard.mutateAsync({
                spaceId: spaceId,
                spaceCardId: focusSpaceCard.id,
              });
              fetchDeleteCardTitle(focusSpaceCard.targetCardId);
              goNextSpaceCard();
            }}
            startContent={<LuCopyMinus />}
          >
            <div className="flex items-center gap-2">刪除當前卡片</div>
          </DropdownItem>
          <DropdownItem
            key="scroll-action"
            onClick={() => onTextModalOpenChange()}
            startContent={<MdOutlineSettingsInputComponent />}
          >
            滑動方向設定
          </DropdownItem>
          <DropdownItem
            key="threads-list"
            onClick={() => toggleInfiniteScrollMode()}
            startContent={<FaThreads />}
          >
            {isInfiniteScrollMode ? "關閉" : "開啟"}串文模式
          </DropdownItem>
          <DropdownItem
            key="outline-route"
            onClick={() => toggleIsMindMapOpen()}
            startContent={<TbRouteSquare2 />}
          >
            {isMindMapOpen ? "關閉" : "開啟"}大綱路徑
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <MobileSpaceHeaderBarTouchActionModal
        isOpen={isTextModalOpen}
        onOpenChange={onTextModalOpenChange}
      />
    </>
  );
}

function MobileSpaceViewHeaderBar() {
  const router = useRouter();

  return (
    <div className="flex w-screen justify-between px-6 py-4">
      <Button
        variant="light"
        className=" text-lg"
        onClick={() => router.push("/spaces")}
      >
        <MdArrowBackIosNew />
      </Button>
      <SpaceHeaderBarRetitleInput
        inputClassName="text-lg font-bold"
        buttonClassName="text-lg  font-bold"
      />
      <MobileSpaceHeaderBarMoreButton />
    </div>
  );
}

function MobileSpaceEditHeaderBar() {
  const { toggleIsEditing } = useMobileIsEditing();

  return (
    <div className="flex w-screen justify-between px-6 py-4">
      <Button variant="light" className=" text-lg" onClick={toggleIsEditing}>
        <MdOutlineCheck />
      </Button>
      <MobileSpaceHeaderBarMoreButton />
    </div>
  );
}

function MobileSpaceHeaderBar() {
  const { isEditing } = useMobileIsEditing();

  if (isEditing) {
    return <MobileSpaceEditHeaderBar />;
  } else {
    return <MobileSpaceViewHeaderBar />;
  }
}

export default MobileSpaceHeaderBar;
