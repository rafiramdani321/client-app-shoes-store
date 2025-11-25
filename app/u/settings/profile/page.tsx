"use client";

import React from "react";
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ProfilePage() {
  const [openDate, setOpenDate] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [disabledFormData, setDisabledFormData] = React.useState(true);
  const [disabledInputEmail, setDisabledInputEmail] = React.useState(true);

  return (
    <div className="w-full flex gap-8">
      <div className="w-[20%] h-fit shrink-0 border p-3 rounded-md shadow-md">
        <div className="relative w-full aspect-square rounded-md overflow-hidden border">
          <Image
            src="https://lh3.googleusercontent.com/a/ACg8ocIMM98z9utCKD-lAl6WDDRHIowRqZIH4uT3QSkWDyu-QS2cFA=s96-c"
            alt="image-user"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <Button type="button" variant="outline" className="w-full mt-5">
          Change Foto
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">
          Maximum file size 4 MB. The file extention must be JPG, JPEG, PNG
        </p>
      </div>
      <div className="w-full">
        <div>
          <h2 className="text-base font-bold text-muted-foreground">Profile</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-[180px_1fr] gap-x-6 mt-2">
              <Label
                htmlFor="fullname"
                className="text-sm text-muted-foreground font-medium self-center"
              >
                Fullname *
              </Label>
              <Input
                type="text"
                name="fullname"
                id="fullname"
                placeholder="Fullname"
                value={"Rafi ramdani"}
                className="h-9 w-[300px] text-sm disabled:opacity-100 disabled:text-muted-foreground disabled:cursor-default"
                disabled={disabledFormData}
              />
            </div>
            <div className="grid grid-cols-[180px_1fr] gap-x-6 mt-2">
              <Label
                htmlFor="date"
                className="text-sm text-muted-foreground font-medium self-center"
              >
                Date of Birth
              </Label>
              <Popover open={openDate} onOpenChange={setOpenDate}>
                <PopoverTrigger asChild>
                  <Button
                    disabled={disabledFormData}
                    variant="outline"
                    id="date"
                    className="w-48 justify-between font-normal disabled:opacity-100 disabled:text-muted-foreground disabled:cursor-default"
                  >
                    {date ? date.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setDate(date);
                      setOpenDate(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-[180px_1fr] gap-x-6 mt-2">
              <Label
                htmlFor="gender"
                className="text-sm text-muted-foreground font-medium self-center"
              >
                Gender
              </Label>
              <RadioGroup defaultValue="male" className="space-y-1">
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value="male"
                    id="r1"
                    disabled={disabledFormData}
                  />
                  <Label htmlFor="r1">Male</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value="female"
                    id="r2"
                    disabled={disabledFormData}
                  />
                  <Label htmlFor="r2">Female</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        <div className="mt-7">
          <h2 className="text-base font-bold text-muted-foreground">Contact</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-[180px_1fr] gap-x-6 mt-2">
              <Label
                htmlFor="Email"
                className="text-sm text-muted-foreground font-medium self-center"
              >
                Email *
              </Label>
              <div className="flex gap-x-2 items-center">
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="example@example.com"
                  value={"rafiramdani@gmail.com"}
                  className="h-9 w-[300px] text-sm disabled:opacity-100 disabled:text-muted-foreground disabled:cursor-default"
                  disabled={disabledInputEmail}
                />
                {disabledInputEmail ? (
                  <Button
                    type="button"
                    variant={"ghost"}
                    size="sm"
                    className="underline"
                    onClick={() => setDisabledInputEmail(false)}
                  >
                    Change Email
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant={"destructive"}
                    size="sm"
                    onClick={() => setDisabledInputEmail(true)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-[180px_1fr] gap-x-6 mt-2">
              <Label
                htmlFor="phone"
                className="text-sm text-muted-foreground font-medium self-center"
              >
                Phone number *
              </Label>
              <Input
                type="number"
                name="phone"
                id="phone"
                placeholder="Phone number"
                value={"08136845634"}
                className="h-9 w-[300px] text-sm disabled:opacity-100 disabled:text-muted-foreground disabled:cursor-default"
                disabled={disabledFormData}
              />
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex items-center gap-x-3">
            {disabledFormData ? (
              <Button type="button" onClick={() => setDisabledFormData(false)}>
                Change Data
              </Button>
            ) : (
              <Button type="button" onClick={() => {}}>
                Save
              </Button>
            )}
            {!disabledFormData && (
              <Button
                type="button"
                variant={"destructive"}
                onClick={() => setDisabledFormData(true)}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
