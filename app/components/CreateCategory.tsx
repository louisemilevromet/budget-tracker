"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { CircleOff, AlertCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface CreateCategoryProps {
  isOpen: boolean;
  onClose: (newCategoryName?: string) => void;
  type: "income" | "expense";
  onCancel?: () => void;
}

interface CategoryData {
  type: "income" | "expense";
  name: string;
  icon: string;
}

const CreateCategory: React.FC<CreateCategoryProps> = ({
  isOpen,
  onClose,
  type,
  onCancel,
}) => {
  const [categoryData, setCategoryData] = useState<CategoryData>({
    type,
    name: "",
    icon: "",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [error, setError] = useState("");
  const createCategory = useMutation(api.categories.createCategory);
  const { user } = useUser();

  useEffect(() => {
    if (isOpen) {
      setCategoryData({
        type,
        name: "",
        icon: "",
      });
      setSelectedEmoji("");
      setError("");
    }
  }, [isOpen, type]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmojiClick = (emojiObject: any) => {
    setCategoryData((prev) => ({
      ...prev,
      icon: emojiObject.emoji,
    }));
    setShowEmojiPicker(false);
    setSelectedEmoji(emojiObject.emoji);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryData.icon) {
      setError("Please select an icon");
      return;
    }
    try {
      await createCategory({
        clerkId: user?.id ?? "",
        type: type,
        name: categoryData.name.charAt(0).toUpperCase() + categoryData.name.slice(1),
        icon: categoryData.icon,
      });
      setError("");
      onClose(categoryData.name.charAt(0).toUpperCase() + categoryData.name.slice(1));
    } catch (error: any) {
      setError("A category with this name already exists");
      return;
    }
  };

  return (
    <Dialog
      open={isOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new{" "}
            <span
              className={type === "income" ? "text-green-500" : "text-red-500"}
            >
              {type}
            </span>{" "}
            category
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4 !text-rose-50" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                value={categoryData.name}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon" className="w-fit">
                Icon
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="category"
                  type="button"
                  id="icon"
                  name="icon"
                  value={categoryData.icon}
                  className="w-full h-28"
                  onClick={() => setShowEmojiPicker(true)}
                >
                  <div className="flex flex-col items-center gap-2">
                    {selectedEmoji ? (
                      <span className="text-5xl" role="img">
                        {selectedEmoji}
                      </span>
                    ) : (
                      <CircleOff className="!w-12 !h-12" />
                    )}
                    <p className="text-xs text-muted-foreground">
                      {selectedEmoji ? "Click to change" : "Select an icon"}
                    </p>
                  </div>
                </Button>
                {showEmojiPicker && (
                  <ClickAwayListener
                    onClickAway={() => setShowEmojiPicker(false)}
                  >
                    <div className="absolute z-10 mt-2">
                      <EmojiPicker
                        theme={Theme.AUTO}
                        onEmojiClick={handleEmojiClick}
                        skinTonesDisabled={true}
                      />
                    </div>
                  </ClickAwayListener>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                onClose();
                onCancel?.();
                setError("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!categoryData.icon || !categoryData.name}
            >
              Create Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategory;
