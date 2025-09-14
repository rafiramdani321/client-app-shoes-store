import React from "react";

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
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseMutationResult } from "@tanstack/react-query";

interface BtnDeleteDialogProps {
  rowSelection: {};
  deleteManyProducts: UseMutationResult<any, Error, string[], unknown>;
  setRowSelection: (value: React.SetStateAction<{}>) => void;
}

const ButtonDeleteDialog = ({
  rowSelection,
  deleteManyProducts,
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
            <AlertDialogTitle>Are you deleted products?</AlertDialogTitle>
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
                deleteManyProducts.mutate(ids);
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
