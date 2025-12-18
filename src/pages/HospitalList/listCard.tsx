import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import type { Hospital } from "./listSlide";
import { useNavigate } from "react-router-dom";

interface Hosprops {
  hospital: Hospital;
}

const navigate = useNavigate();

const GoRegister = () => {
  navigate("/hospital/register");
};

export default function HospitalCard({ hospital }: Hosprops) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{hospital.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6 mb-7">
            <div className="grid gap-2">
              <Label htmlFor="email">진료과목 : {hospital.Subject}</Label>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">주소 : {hospital.location}</Label>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col">
        <Button type="submit" className="w-full cursor-pointer">
          이동하기
        </Button>
      </CardFooter>
    </Card>
  );
}
