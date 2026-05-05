interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

let nextId = 0;

export const useToast = () => {
  const toasts = useState<Toast[]>("toasts", () => []);

  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = nextId++;
    toasts.value.push({ id, message, type });
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 4000);
  };

  return { toasts, addToast };
};
