import { useState, useEffect } from "react";
import { useFormik, type FormikValues } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle, ChevronsUpDown, Check } from "lucide-react";
import useDeviceMeta from "@/hooks/use-device-meta";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  getDistricts,
  getMandals,
  getSecretariats,
  type DistrictData,
} from "@/lib/data-utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";

const QUALIFICATIONS = ["BE/B.Tech", "B.Com/BA", "B.Sc/M.Sc", "Diploma"];

// Mock data for templates
const MOCK_TEMPLATES = [
  { id: "1", title: "Software Development" },
  { id: "2", title: "Data Science" },
  { id: "3", title: "Web Development" },
  { id: "4", title: "Mobile Development" },
  { id: "5", title: "DevOps Engineering" },
];

// Mock data for districts
const MOCK_DISTRICT_DATA = {
  Anantapur: {
    Anantapur: ["Anantapur", "Bathalapalli", "Guntakal"],
    Dharmavaram: ["Dharmavaram", "Penukonda", "Rayadurg"],
    Hindupur: ["Hindupur", "Madakasira", "Rolla"],
  },
  Chittoor: {
    Chittoor: ["Chittoor", "Palamaner", "Vellore"],
    Tirupati: ["Tirupati", "Chandragiri", "Renigunta"],
    Madanapalle: ["Madanapalle", "Punganur", "Horsley Hills"],
  },
  "East Godavari": {
    Kakinada: ["Kakinada", "Pithapuram", "Samalkota"],
    Rajahmundry: ["Rajahmundry", "Kovvur", "Nidadavole"],
    Amalapuram: ["Amalapuram", "Razole", "Mummidivaram"],
  },
  Guntur: {
    Guntur: ["Guntur", "Mangalagiri", "Tadepalle"],
    Tenali: ["Tenali", "Repalle", "Bapatla"],
    Narasaraopet: ["Narasaraopet", "Sattenapalle", "Vinukonda"],
  },
  Krishna: {
    Vijayawada: ["Vijayawada", "Gannavaram", "Ibrahimpatnam"],
    Machilipatnam: ["Machilipatnam", "Pedana", "Gudivada"],
    Nuzvidu: ["Nuzvidu", "Tiruvuru", "Musunuru"],
  },
};

export default function StartTestPage() {
  const navigate = useNavigate();

  const device = useDeviceMeta();
  const [templates, setTemplates] = useState<typeof MOCK_TEMPLATES>([]);
  const [loading, setLoading] = useState(false);
  const [district, setDistrict] = useState<string>("");
  const [mandal, setMandal] = useState<string>("");
  const [secretariat, setSecretariat] = useState<string>("");
  const [districtOpen, setDistrictOpen] = useState(false);
  const [mandalOpen, setMandalOpen] = useState(false);
  const [secretariatOpen, setSecretariatOpen] = useState(false);
  const [qualificationOpen, setQualificationOpen] = useState(false);
  const [qualification, setQualification] = useState<string>("");
  const [districtData, setDistrictData] = useState<
    typeof MOCK_DISTRICT_DATA | object
  >({});

  useEffect(() => {
    // Simulate loading templates with mock data
    const loadTemplates = () => {
      setLoading(true);
      setTimeout(() => {
        setTemplates(MOCK_TEMPLATES);
        setLoading(false);
      }, 1000);
    };
    loadTemplates();
  }, []);

  useEffect(() => {
    // Load mock district data
    setDistrictData(MOCK_DISTRICT_DATA);
  }, []);

  useEffect(() => {
    setMandal("");
    setSecretariat("");
    formik.setFieldValue("mandal", "");
    formik.setFieldValue("secretariat", "");
  }, [district]);

  useEffect(() => {
    setSecretariat("");
    formik.setFieldValue("secretariat", "");
  }, [mandal]);

  const districts = getDistricts(districtData as DistrictData);
  const mandals = getMandals(districtData as DistrictData, district);
  const secretariats = getSecretariats(
    districtData as DistrictData,
    district,
    mandal
  );

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^\+91\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    template_id: Yup.string().required("Template selection is required"),
    district: Yup.string().required("District selection is required"),
    mandal: Yup.string().required("Mandal selection is required"),
    secretariat: Yup.string().required("Secretariat selection is required"),
    qualification: Yup.string().required("Qualification is required"),
    graduation_year: Yup.string().required("Year is required"),
    is_currently_working: Yup.string().required("Select work status"),
    organization_name: Yup.string().test(
      "org-required-if-working",
      "Organization name is required",
      function (value) {
        const { is_currently_working } = this.parent;
        if (is_currently_working === "yes" && !value) {
          return false;
        }
        return true;
      }
    ),
    has_worked_before: Yup.string().when(
      "is_currently_working",
      (isCurrentlyWorking, schema) => {
        // @ts-expect-error just ignore
        if (isCurrentlyWorking === "no") {
          return schema
            .required("Please select an option")
            .test(
              "not-null",
              "Please select an option.",
              (value) => value !== null
            );
        }
        return schema.notRequired();
      }
    ),
    previous_organization_name: Yup.string().when(
      ["is_currently_working", "has_worked_before"],
      ([isWorking, hasWorked], schema) => {
        return isWorking === "no" && hasWorked === "yes"
          ? schema.required("Previous org name is required")
          : schema.notRequired();
      }
    ),
    reason_for_leaving: Yup.string().when(
      ["is_currently_working", "has_worked_before"],
      ([isWorking, hasWorked], schema) => {
        return isWorking === "no" && hasWorked === "yes"
          ? schema.required("Field is required")
          : schema.notRequired();
      }
    ),
    has_worked_from_home: Yup.string().when(
      ["is_currently_working", "has_worked_before"],
      ([isWorking, hasWorked], schema) => {
        if (isWorking === "yes" || hasWorked === "yes") {
          return schema
            .required("Please select an option")
            .test(
              "not-null",
              "Please select an option.",
              (value) => value !== null
            );
        }
        return schema.notRequired();
      }
    ),
  });

  const handleSubmit = async (values: FormikValues) => {
    try {
      // Simulate form submission
      console.log("Form submitted with values:", {
        ...values,
        system_info: device,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
      const mockTestId = "test_" + Date.now();
      navigate(`/pre-test/${mockTestId}`, {
        replace: true,
        state: {
          values,
          system_info: device,
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      template_id: "",
      district: "",
      mandal: "",
      secretariat: "",
      qualification: "",
      graduation_year: "",
      is_currently_working: "",
      organization_name: "",
      has_worked_before: "",
      previous_organization_name: "",
      reason_for_leaving: "",
      has_worked_from_home: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const generateYearOptions = () => {
    const years = [];
    for (let year = 2025; year >= 2015; year--) {
      years.push(year);
    }
    return years;
  };

  const handleTemplateSelect = (value: string) => {
    formik.setFieldValue("template_id", value);
  };

  const handleDistrictSelect = (value: string) => {
    setDistrict(value);
    formik.setFieldValue("district", value);
    setDistrictOpen(false);
  };

  const handleMandalSelect = (value: string) => {
    setMandal(value);
    formik.setFieldValue("mandal", value);
    setMandalOpen(false);
  };

  const handleSecretariatSelect = (value: string) => {
    setSecretariat(value);
    formik.setFieldValue("secretariat", value);
    setSecretariatOpen(false);
  };

  const handleQualificationSelect = (value: string) => {
    setQualification(value);
    formik.setFieldValue("qualification", value);
    setQualificationOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Hero Section - Left */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Assess Your Skills
            </h1>
            <p className="text-xl text-muted-foreground">
              Take our comprehensive assessment to evaluate your technical
              abilities and find the perfect role for your talents.
            </p>
            <p className="text-muted-foreground">
              Our assessment platform helps you:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 h-5 w-5 mt-0.5 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3 text-green-600"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Identify your strengths and areas for improvement</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 h-5 w-5 mt-0.5 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3 text-green-600"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Receive personalized feedback from industry experts</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 h-5 w-5 mt-0.5 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3 text-green-600"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>
                  Connect with employers looking for your specific skill set
                </span>
              </li>
            </ul>
          </div>
          {/* Form Card - Right */}
          <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="mx-auto max-w-3xl shadow-lg border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl sm:text-2xl text-start font-bold">
                    Start Your Test
                  </CardTitle>
                  <CardDescription className="text-start text-slate-500">
                    Fill in your details and select a test template to begin
                    your assessment
                  </CardDescription>
                </CardHeader>
                <form onSubmit={formik.handleSubmit}>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-medium">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter your full name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={cn(
                            "transition-all",
                            formik.touched.name && formik.errors.name
                              ? "border-red-500 focus-visible:ring-red-500"
                              : "focus-visible:ring-emerald-500"
                          )}
                        />
                        {formik.touched.name && formik.errors.name && (
                          <div className="mt-1 flex items-center text-sm text-red-500">
                            <AlertCircle className="mr-1 h-4 w-4" />
                            {formik.errors.name}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={cn(
                            "transition-all",
                            formik.touched.email && formik.errors.email
                              ? "border-red-500 focus-visible:ring-red-500"
                              : "focus-visible:ring-emerald-500"
                          )}
                        />
                        {formik.touched.email && formik.errors.email && (
                          <div className="mt-1 flex items-center text-sm text-red-500">
                            <AlertCircle className="mr-1 h-4 w-4" />
                            {formik.errors.email}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-medium">
                          Phone Number
                        </Label>
                        <PhoneInput
                          id="phone"
                          defaultCountry="IN"
                          countries={["IN"]}
                          name="phone"
                          placeholder="Enter your phone number"
                          value={formik.values.phone}
                          onChange={(value) => {
                            formik.setFieldValue("phone", value);
                          }}
                          className={cn(
                            "transition-all",
                            formik.touched.phone && formik.errors.phone
                              ? "border-red-500 focus-visible:ring-red-500"
                              : "focus-visible:ring-emerald-500"
                          )}
                        />
                        {formik.touched.phone && formik.errors.phone && (
                          <div className="mt-1 flex items-center text-sm text-red-500">
                            <AlertCircle className="mr-1 h-4 w-4" />
                            {formik.errors.phone}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district" className="font-medium">
                          District
                        </Label>
                        <Popover
                          open={districtOpen}
                          onOpenChange={setDistrictOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={districtOpen}
                              className={cn(
                                "w-full justify-between transition-all",
                                formik.touched.district &&
                                  formik.errors.district
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : "focus-visible:ring-emerald-500"
                              )}
                            >
                              {district ? district : "Select district"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search district" />
                              <CommandList>
                                <CommandEmpty>No district found.</CommandEmpty>
                                <CommandGroup className="max-h-[300px] overflow-y-auto">
                                  {districts.map((d) => (
                                    <CommandItem
                                      key={d}
                                      value={d}
                                      onSelect={() => handleDistrictSelect(d)}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          district === d
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {d}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {formik.touched.district && formik.errors.district && (
                          <div className="mt-1 flex items-center text-sm text-red-500">
                            <AlertCircle className="mr-1 h-4 w-4" />
                            {formik.errors.district}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mandal" className="font-medium">
                          Mandal
                        </Label>
                        <Popover open={mandalOpen} onOpenChange={setMandalOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={mandalOpen}
                              className={cn(
                                "w-full justify-between transition-all",
                                formik.touched.mandal && formik.errors.mandal
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : "focus-visible:ring-emerald-500"
                              )}
                              disabled={!district}
                            >
                              {mandal ? mandal : "Select mandal"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search mandal" />
                              <CommandList>
                                <CommandEmpty>No mandal found.</CommandEmpty>
                                <CommandGroup className="max-h-[300px] overflow-y-auto">
                                  {mandals.map((m) => (
                                    <CommandItem
                                      key={m}
                                      value={m}
                                      onSelect={() => handleMandalSelect(m)}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          mandal === m
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {m}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {formik.touched.mandal && formik.errors.mandal && (
                          <div className="mt-1 flex items-center text-sm text-red-500">
                            <AlertCircle className="mr-1 h-4 w-4" />
                            {formik.errors.mandal}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secretariat" className="font-medium">
                          Secretariat
                        </Label>
                        <Popover
                          open={secretariatOpen}
                          onOpenChange={setSecretariatOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={secretariatOpen}
                              className={cn(
                                "w-full justify-between transition-all",
                                formik.touched.secretariat &&
                                  formik.errors.secretariat
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : "focus-visible:ring-emerald-500"
                              )}
                              disabled={!mandal}
                            >
                              {secretariat ? secretariat : "Select secretariat"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search secretariat" />
                              <CommandList>
                                <CommandEmpty>
                                  No secretariat found.
                                </CommandEmpty>
                                <CommandGroup className="max-h-[300px] overflow-y-auto">
                                  {secretariats.map((s) => (
                                    <CommandItem
                                      key={s}
                                      value={s}
                                      onSelect={() =>
                                        handleSecretariatSelect(s)
                                      }
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          secretariat === s
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {s}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {formik.touched.secretariat &&
                          formik.errors.secretariat && (
                            <div className="mt-1 flex items-center text-sm text-red-500">
                              <AlertCircle className="mr-1 h-4 w-4" />
                              {formik.errors.secretariat}
                            </div>
                          )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="qualification" className="font-medium">
                          Qualification
                        </Label>
                        <Popover
                          open={qualificationOpen}
                          onOpenChange={setQualificationOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={qualificationOpen}
                              className={cn(
                                "w-full justify-between transition-all",
                                formik.touched.qualification &&
                                  formik.errors.qualification
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : "focus-visible:ring-emerald-500"
                              )}
                            >
                              {qualification
                                ? qualification
                                : "Select qualification"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search qualification" />
                              <CommandList>
                                <CommandEmpty>
                                  No qualification found.
                                </CommandEmpty>
                                <CommandGroup>
                                  {QUALIFICATIONS.map((q) => (
                                    <CommandItem
                                      key={q}
                                      value={q}
                                      onSelect={() =>
                                        handleQualificationSelect(q)
                                      }
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          qualification === q
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {q}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {formik.touched.qualification &&
                          formik.errors.qualification && (
                            <div className="mt-1 flex items-center text-sm text-red-500">
                              <AlertCircle className="mr-1 h-4 w-4" />
                              {formik.errors.qualification}
                            </div>
                          )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="template_id" className="font-medium">
                          Stream
                        </Label>
                        {loading ? (
                          <div className="flex items-center space-x-2 h-10 px-3 border rounded-md">
                            <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                            <span className="text-sm text-slate-500">
                              Loading templates
                            </span>
                          </div>
                        ) : (
                          <Select
                            value={formik.values.template_id}
                            onValueChange={handleTemplateSelect}
                          >
                            <SelectTrigger
                              className={cn(
                                "w-full transition-all",
                                formik.touched.template_id &&
                                  formik.errors.template_id
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : "focus-visible:ring-emerald-500"
                              )}
                            >
                              <SelectValue placeholder="Select a stream" />
                            </SelectTrigger>
                            <SelectContent>
                              {templates.map((template) => (
                                <SelectItem
                                  key={template.id}
                                  value={template.id}
                                >
                                  {template.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {formik.touched.template_id &&
                          formik.errors.template_id && (
                            <div className="mt-1 flex items-center text-sm text-red-500">
                              <AlertCircle className="mr-1 h-4 w-4" />
                              {formik.errors.template_id}
                            </div>
                          )}
                      </div>
                      {/* ----------------- */}
                      <div className="space-y-2">
                        <Label htmlFor="graduation_year">
                          Year of Passing out of graduation
                        </Label>
                        <Select
                          value={formik.values.graduation_year}
                          onValueChange={(value) =>
                            formik.setFieldValue("graduation_year", value)
                          }
                        >
                          <SelectTrigger
                            id="graduation_year"
                            className={cn(
                              "w-full transition-all",
                              formik.touched.graduation_year &&
                                formik.errors.graduation_year
                                ? "border-red-500 focus-visible:ring-red-500"
                                : "focus-visible:ring-emerald-500"
                            )}
                          >
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {generateYearOptions().map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formik.touched.graduation_year &&
                          formik.errors.graduation_year && (
                            <div className="mt-1 flex items-center text-sm text-red-500">
                              <AlertCircle className="mr-1 h-4 w-4" />
                              {formik.errors.graduation_year}
                            </div>
                          )}
                      </div>
                      {/* Currently Working */}
                      <div className="space-y-2">
                        <Label>Are you currently working?</Label>
                        <Select
                          value={formik.values.is_currently_working}
                          onValueChange={(value) =>
                            formik.setFieldValue("is_currently_working", value)
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              "w-full transition-all",
                              formik.touched.is_currently_working &&
                                formik.errors.is_currently_working
                                ? "border-red-500 focus-visible:ring-red-500"
                                : "focus-visible:ring-emerald-500"
                            )}
                          >
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {formik.touched.is_currently_working &&
                          formik.errors.is_currently_working && (
                            <div className="mt-1 flex items-center text-sm text-red-500">
                              <AlertCircle className="mr-1 h-4 w-4" />
                              {formik.errors.is_currently_working}
                            </div>
                          )}
                      </div>
                      {/* Organization Name (if currently working) */}
                      {formik.values.is_currently_working === "yes" && (
                        <div className="space-y-2">
                          <Label htmlFor="organization_name">
                            Organization Name
                          </Label>
                          <Input
                            id="organization_name"
                            name="organization_name"
                            value={formik.values.organization_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter your organization name"
                            className={cn(
                              "transition-all",
                              formik.touched.organization_name &&
                                formik.errors.organization_name
                                ? "border-red-500 focus-visible:ring-red-500"
                                : "focus-visible:ring-emerald-500"
                            )}
                          />
                          {formik.touched.organization_name &&
                            formik.errors.organization_name && (
                              <div className="mt-1 flex items-center text-sm text-red-500">
                                <AlertCircle className="mr-1 h-4 w-4" />
                                {formik.errors.organization_name}
                              </div>
                            )}
                        </div>
                      )}
                      {/* Previous Job (if not currently working) */}
                      {formik.values.is_currently_working === "no" && (
                        <div className="space-y-2">
                          <Label>Have you worked in a job before?</Label>
                          <Select
                            value={formik.values.has_worked_before}
                            onValueChange={(value) =>
                              formik.setFieldValue("has_worked_before", value)
                            }
                          >
                            <SelectTrigger
                              className={cn(
                                "w-full transition-all",
                                formik.touched.has_worked_before &&
                                  formik.errors.has_worked_before
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : "focus-visible:ring-emerald-500"
                              )}
                            >
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          {formik.touched.has_worked_before &&
                            formik.errors.has_worked_before && (
                              <div className="mt-1 flex items-center text-sm text-red-500">
                                <AlertCircle className="mr-1 h-4 w-4" />
                                {formik.errors.has_worked_before}
                              </div>
                            )}
                        </div>
                      )}
                      {/* Previous Organization Name */}
                      {formik.values.is_currently_working === "no" &&
                        formik.values.has_worked_before === "yes" && (
                          <div className="space-y-2">
                            <Label htmlFor="previous_organization_name">
                              Organization Name
                            </Label>
                            <Input
                              id="previous_organization_name"
                              name="previous_organization_name"
                              value={formik.values.previous_organization_name}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              placeholder="Enter your previous organization name"
                              className={cn(
                                "transition-all",
                                formik.touched.previous_organization_name &&
                                  formik.errors.previous_organization_name
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : "focus-visible:ring-emerald-500"
                              )}
                            />
                            {formik.touched.previous_organization_name &&
                              formik.errors.previous_organization_name && (
                                <div className="mt-1 flex items-center text-sm text-red-500">
                                  <AlertCircle className="mr-1 h-4 w-4" />
                                  {formik.errors.previous_organization_name}
                                </div>
                              )}
                          </div>
                        )}
                      {/* Reason */}
                      {formik.values.is_currently_working === "no" &&
                        formik.values.has_worked_before === "yes" && (
                          <div className="space-y-2">
                            <Label htmlFor="reason_for_leaving">
                              Reason for Leaving
                            </Label>
                            <Select
                              value={formik.values.reason_for_leaving}
                              onValueChange={(value) =>
                                formik.setFieldValue(
                                  "reason_for_leaving",
                                  value
                                )
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  "w-full transition-all",
                                  formik.touched.reason_for_leaving &&
                                    formik.errors.reason_for_leaving
                                    ? "border-red-500 focus-visible:ring-red-500"
                                    : "focus-visible:ring-emerald-500"
                                )}
                              >
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="To come back to home town">
                                    To come back to home town
                                  </SelectItem>
                                  <SelectItem value="Due to maternity">
                                    Due to maternity
                                  </SelectItem>
                                  <SelectItem value="Family issues">
                                    Family issues
                                  </SelectItem>
                                  <SelectItem value="Company problems">
                                    Company problems
                                  </SelectItem>
                                  <SelectItem value="Less salary">
                                    Less salary
                                  </SelectItem>
                                  <SelectItem value="Others">Others</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            {formik.touched.reason_for_leaving &&
                              formik.errors.reason_for_leaving && (
                                <div className="mt-1 flex items-center text-sm text-red-500">
                                  <AlertCircle className="mr-1 h-4 w-4" />
                                  {formik.errors.reason_for_leaving}
                                </div>
                              )}
                          </div>
                        )}
                      {/* Work From Home Experience */}
                      {(formik.values.is_currently_working === "yes" ||
                        formik.values.has_worked_before === "yes") && (
                        <div className="space-y-2">
                          <Label>Have you ever done work from home?</Label>
                          <Select
                            value={formik.values.has_worked_from_home}
                            onValueChange={(value) =>
                              formik.setFieldValue(
                                "has_worked_from_home",
                                value
                              )
                            }
                          >
                            <SelectTrigger
                              className={cn(
                                "w-full transition-all",
                                formik.touched.has_worked_from_home &&
                                  formik.errors.has_worked_from_home
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : "focus-visible:ring-emerald-500"
                              )}
                            >
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                          {formik.touched.has_worked_from_home &&
                            formik.errors.has_worked_from_home && (
                              <div className="mt-1 flex items-center text-sm text-red-500">
                                <AlertCircle className="mr-1 h-4 w-4" />
                                {formik.errors.has_worked_from_home}
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 pb-6 px-6">
                    <Button
                      type="submit"
                      className="w-full text-white font-medium py-2.5"
                      disabled={formik.isSubmitting || loading}
                    >
                      {formik.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Starting Test
                        </>
                      ) : (
                        "Start Test"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="container mx-auto px-4 py-8 mt-8 text-center text-sm text-muted-foreground">
        © 2025 AlgoHire. All rights reserved.
      </div>
    </div>
  );
}
