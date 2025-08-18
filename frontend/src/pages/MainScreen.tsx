import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tv,
  Settings,
  Smartphone,
  Wifi,
  PlayCircle,
  Shield,
  Zap,
  Users,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Tv,
    title: "3D Device Models",
    description: "Interactive 3D models of all supported set-top boxes",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Settings,
    title: "Setup Guidance",
    description: "Step-by-step configuration instructions",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Smartphone,
    title: "Remote Control",
    description: "Virtual remote control simulation",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Wifi,
    title: "Network Setup",
    description: "Easy network and connection setup",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: PlayCircle,
    title: "Channel Management",
    description: "Organize and manage your TV channels",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Shield,
    title: "Support 24/7",
    description: "Round-the-clock technical support",
    color: "from-indigo-500 to-indigo-600",
  },
];

const devices = [
  { name: "OpenBox", users: "2.3M+", status: "active" },
  { name: "OpenBox Gold", users: "1.8M+", status: "active" },
  { name: "Uclan", users: "1.2M+", status: "active" },
  { name: "HDBox", users: "950K+", status: "active" },
];

export default function MainScreen() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/select-device");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.section
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 text-shadow"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            ANT{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Support
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Your comprehensive platform for digital TV set-top box support. Get
            expert guidance, interactive 3D models, and 24/7 assistance.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="nav-button group text-lg px-8 py-4"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate("/support")}
            >
              Contact Support
            </Button>
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {devices.map((device, index) => (
              <motion.div
                key={device.name}
                className="glass rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {device.name}
                </h3>
                <p className="text-2xl font-bold text-blue-400 mb-1">
                  {device.users}
                </p>
                <div className="flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  <span className="text-sm text-gray-400">Active</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-shadow">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Comprehensive tools and resources to help you get the most out of
              your digital TV experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
              >
                <Card className="device-card h-full group cursor-pointer">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          className="text-center py-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <div className="glass rounded-2xl p-12 max-w-4xl mx-auto">
            <Zap className="h-16 w-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-shadow">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join millions of users who trust ANT Support for their digital TV
              needs. Get instant access to our comprehensive support platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="nav-button group"
              >
                <Users className="mr-2 h-5 w-5" />
                Choose Your Device
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
}
