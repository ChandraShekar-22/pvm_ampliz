import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FeatherModule } from "angular-feather";
import { Users, User, Github, ArrowRight, X, Lock,Headphones, Square, CheckSquare,Chrome,PhoneCall, Download, Globe	 } from "angular-feather/icons";
const icons = {
  Users,
  User,
  Github,
  ArrowRight,
  X,
  Lock,
  Headphones,
  Chrome,
  PhoneCall,
  Square,
  CheckSquare,
  Download,
  Globe
};

@NgModule({
  imports: [FeatherModule.pick(icons)],
  exports: [FeatherModule],
})
export class IconsModule {}
