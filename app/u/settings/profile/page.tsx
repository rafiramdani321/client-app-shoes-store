"use client";

import React from "react";
import { ChevronDownIcon } from "lucide-react";

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
import { useUsers } from "@/hooks/useUsers";
import { updateMyProfileValidation } from "@/lib/validations/validationSchema";
import { validationResponses } from "@/lib/validations";
import { buildErrorMap } from "@/lib/errorMap";
import { showToastError } from "@/lib/toast";
import { cn } from "@/lib/utils";
import ImageProfile from "./imageProfile";
import DialodUpdateEmail from "./dialog-update-email";

type Gender = "MALE" | "FEMALE" | "";

type ProfileForm = {
  username: string;
  fullname: string;
  date_of_birth: Date | undefined;
  gender: Gender;
  email: string;
  phone_number: string;
  pending_new_email: string | null;
};

export default function ProfilePage() {
  const { useGetMyProfile, updateMyProfile } = useUsers();

  const [openDate, setOpenDate] = React.useState(false);
  const [disabledFormData, setDisabledFormData] = React.useState(true);
  const [openDialogUpdateEmail, setOpenDialogUpdateEmail] =
    React.useState(false);
  const [initialFormData, setInitialFormData] =
    React.useState<ProfileForm | null>(null);
  const [errorsInput, setErrorsInput] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});
  const [loading, setLoading] = React.useState(false);
  const [autoFocus, setAutoFocus] = React.useState(false);

  const inputRef = React.useRef<{
    username: HTMLInputElement | null;
    fullname: HTMLInputElement | null;
    phone_number: HTMLInputElement | null;
  }>({
    username: null,
    fullname: null,
    phone_number: null,
  });

  React.useEffect(() => {
    if (!autoFocus) return;
    if (errorsInput.username && inputRef.current.username) {
      inputRef.current.username.focus();
    } else if (errorsInput.fullname && inputRef.current.fullname) {
      inputRef.current.fullname.focus();
    } else if (errorsInput.phone_number && inputRef.current.phone_number) {
      inputRef.current.phone_number.focus();
    }

    setAutoFocus(false);
  }, [errorsInput, autoFocus]);

  const [formData, setFormData] = React.useState<ProfileForm>({
    username: "",
    fullname: "",
    date_of_birth: undefined,
    gender: "",
    email: "",
    phone_number: "",
    pending_new_email: "",
  });

  const { data, isLoading } = useGetMyProfile();

  React.useEffect(() => {
    if (!data?.data) return;

    const mappedData: ProfileForm = {
      username: data.data.username ?? "",
      fullname: data.data.fullname ?? "",
      email: data.data.email ?? "",
      phone_number: data.data.phone_number ?? "",
      gender: data.data.gender ?? "",
      date_of_birth: data.data.date_of_birth
        ? new Date(data.data.date_of_birth)
        : undefined,
      pending_new_email: data.data.pending_new_email ?? null,
    };

    setFormData(mappedData);
    setInitialFormData(mappedData);
  }, [data]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const sanitizedValue =
      name === "username" ? value.replace(/\s+/g, "") : value;

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    setErrorsInput((prev) => ({
      ...prev,
      [name]: [],
    }));
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setInitialFormData(formData);
    setDisabledFormData(false);
  };

  const handleCancel = () => {
    if (!initialFormData) return;

    setFormData(initialFormData);
    setDisabledFormData(true);
    setErrorsInput({});
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      username: formData.username,
      fullname: formData.fullname,
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
      phone_number: formData.phone_number,
    };

    const errorValidationFront = updateMyProfileValidation.safeParse(payload);
    if (!errorValidationFront.success) {
      const errorsFront = validationResponses(errorValidationFront);
      setErrorsInput(buildErrorMap<keyof typeof payload>(errorsFront));
      showToastError("Validation failed.");
      setAutoFocus(true);
      setLoading(false);
      return;
    }

    await updateMyProfile.mutateAsync(payload, {
      onSuccess: () => {
        setErrorsInput({});
        setDisabledFormData(true);
      },
      onError: (err: any) => {
        if (err.details && Array.isArray(err.details)) {
          setAutoFocus(true);
          setErrorsInput(buildErrorMap<keyof typeof payload>(err.details));
        }
      },
      onSettled: () => setLoading(false),
    });
  };

  if (isLoading) return null;

  return (
    <>
      <div className="w-full flex gap-8">
        <ImageProfile
          imageUrl={data.data.image_url}
          imageFileId={data.data.image_file_id}
        />
        <form onSubmit={handleUpdate}>
          <div className="w-full">
            <div>
              <h2 className="text-base font-bold text-muted-foreground">
                Profile
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-[180px_1fr] gap-x-6 mt-2">
                  <Label
                    htmlFor="username"
                    className="text-sm text-muted-foreground font-medium self-center"
                  >
                    Username *
                  </Label>
                  <div>
                    <Input
                      autoFocus
                      ref={(e) => {
                        inputRef.current.username = e;
                      }}
                      type="text"
                      name="username"
                      id="username"
                      placeholder="Username"
                      aria-invalid={!!errorsInput.username?.length}
                      value={formData.username}
                      onChange={handleOnChange}
                      className={cn(
                        "h-9 w-[300px] text-sm disabled:opacity-100 disabled:text-muted-foreground disabled:cursor-default",
                        errorsInput.username?.length &&
                          "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      )}
                      disabled={disabledFormData}
                    />
                    {errorsInput.username?.map((msg, i) => (
                      <p
                        key={i}
                        className="text-rose-500 text-[11px] ml-1 font-semibold"
                      >
                        {`- ${msg}`}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-[180px_1fr] gap-x-6 mt-2">
                  <Label
                    htmlFor="fullname"
                    className="text-sm text-muted-foreground font-medium self-center"
                  >
                    Fullname *
                  </Label>
                  <div>
                    <Input
                      ref={(e) => {
                        inputRef.current.fullname = e;
                      }}
                      type="text"
                      name="fullname"
                      id="fullname"
                      placeholder="Fullname"
                      value={formData.fullname}
                      onChange={handleOnChange}
                      className={cn(
                        "h-9 w-[300px] text-sm disabled:opacity-100 disabled:text-muted-foreground disabled:cursor-default",
                        errorsInput.fullname?.length &&
                          "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      )}
                      disabled={disabledFormData}
                    />
                    {errorsInput.fullname?.map((msg, i) => (
                      <p
                        key={i}
                        className="text-rose-500 text-[11px] ml-1 font-semibold"
                      >
                        {`- ${msg}`}
                      </p>
                    ))}
                  </div>
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
                        type="button"
                        disabled={disabledFormData}
                        variant="outline"
                        id="date"
                        className="w-48 justify-between font-normal disabled:opacity-100 disabled:text-muted-foreground disabled:cursor-default"
                      >
                        {formData.date_of_birth
                          ? formData.date_of_birth.toLocaleDateString()
                          : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={formData.date_of_birth}
                        captionLayout="dropdown"
                        onSelect={(date_of_birth) => {
                          setFormData((prev) => ({
                            ...prev,
                            date_of_birth,
                          }));
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
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        gender: val as Gender,
                      }))
                    }
                    className="space-y-1"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value="MALE"
                        id="r1"
                        disabled={disabledFormData}
                      />
                      <Label htmlFor="r1">Male</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value="FEMALE"
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
              <h2 className="text-base font-bold text-muted-foreground">
                Contact
              </h2>
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
                      value={formData.email}
                      className="h-9 w-[300px] text-sm disabled:opacity-100 disabled:text-muted-foreground disabled:cursor-default"
                      disabled={true}
                    />
                    <Button
                      type="button"
                      variant={"ghost"}
                      size="sm"
                      className="underline"
                      onClick={() => setOpenDialogUpdateEmail(true)}
                    >
                      Change Email
                    </Button>
                  </div>
                </div>
                <div
                  className={cn(
                    "grid grid-cols-[180px_1fr] gap-x-6 mt-2",
                    !formData.pending_new_email && "hidden"
                  )}
                >
                  <Label
                    htmlFor="pending_new_email"
                    className="text-sm text-muted-foreground font-medium self-center"
                  >
                    Pending New Email
                  </Label>
                  <div className="flex gap-x-2 items-center">
                    <Input
                      type="email"
                      name="pending_new_email"
                      id="pending_new_email"
                      value={formData.pending_new_email ?? ""}
                      className="h-9 w-[300px] text-sm disabled:opacity-100 disabled:text-muted-foreground disabled:cursor-default"
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-[180px_1fr] gap-x-6 mt-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm text-muted-foreground font-medium self-center"
                  >
                    Phone number *
                  </Label>
                  <div>
                    <Input
                      ref={(e) => {
                        inputRef.current.phone_number = e;
                      }}
                      type="number"
                      name="phone_number"
                      id="phone_number"
                      placeholder="Phone number"
                      value={formData.phone_number}
                      onChange={handleOnChange}
                      className={cn(
                        "h-9 w-[300px] text-sm disabled:opacity-100 disabled:text-muted-foreground disabled:cursor-default",
                        errorsInput.phone_number?.length &&
                          "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      )}
                      disabled={disabledFormData}
                    />
                    {errorsInput.phone_number?.map((msg, i) => (
                      <p
                        key={i}
                        className="text-rose-500 text-[11px] ml-1 font-semibold"
                      >
                        {`- ${msg}`}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-x-3">
                {disabledFormData ? (
                  <Button type="button" onClick={handleEdit} disabled={loading}>
                    Change Data
                  </Button>
                ) : (
                  <Button type="submit">Save</Button>
                )}
                {!disabledFormData && (
                  <Button
                    type="button"
                    variant={"destructive"}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      <DialodUpdateEmail
        openDialog={openDialogUpdateEmail}
        setOpenDialog={setOpenDialogUpdateEmail}
      />
    </>
  );
}
