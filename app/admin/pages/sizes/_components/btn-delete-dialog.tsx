import React from "react";
import { Trash } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";

import {
  AlertDialogCancel,
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

interface BtnDeleteDialogProps {
  rowSelection: {};
  deleteManySizes: UseMutationResult<any, Error, string[], unknown>;
  setRowSelection: (value: React.SetStateAction<{}>) => void;
}

const ButtonDeleteDialog = ({
  rowSelection,
  deleteManySizes,
  setRowSelection,
}: BtnDeleteDialogProps) => {
  if (Object.keys(rowSelection).length === 0) return null;
  return (
    <div className="mb-2">
      <AlertDialog>
        <AlertDialogTrigger className="border p-1 rounded-md">
          <Hint asChild label="Delete data selection" side="right">
            <Trash className="text-red-600" />
          </Hint>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you deleted sizes?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete and
              remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                const ids = Object.keys(rowSelection);
                deleteManySizes.mutate(ids);
                setRowSelection({});
              }}
            >
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ButtonDeleteDialog;
