import useMobileViewStore from "@/stores/useMobileViewStore";

function useMobileIsEditing() {
  const isEditing = useMobileViewStore((state) => state.isEditing);

  const toggleIsEditing = () => {
    useMobileViewStore.setState({ isEditing: !isEditing });
  };

  return {
    isEditing,
    toggleIsEditing,
  };
}

export default useMobileIsEditing;
