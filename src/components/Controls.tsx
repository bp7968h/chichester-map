import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label"

const formSchema = z.object({
    startLat: z.coerce
        .number()
        .min(-90)
        .max(90, "Latitude must be between -90 and 90"),
    startLng: z.coerce
        .number()
        .min(-180)
        .max(180, "Longitude must be between -180 and 180"),
    endLat: z.coerce
        .number()
        .min(-90)
        .max(90, "Latitude must be between -90 and 90"),
    endLng: z.coerce
        .number()
        .min(-180)
        .max(180, "Longitude must be between -180 and 180"),
    algorithm: z.enum(["dijkstra", "a_star", "bellman_ford"], {
        required_error: "Please select an algorithm",
    }),
});

const Controls: React.FC<{
    start: { lat: number; lng: number } | null;
    end: { lat: number; lng: number } | null;
    setStart: (location: { lat: number; lng: number }) => void;
    setEnd: (location: { lat: number; lng: number }) => void;
    onVisualize: () => void;
  }> = ({ start, end, setStart, setEnd, onVisualize }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            startLat: start?.lat || 0,
            startLng: start?.lng || 0,
            endLat: end?.lat || 0,
            endLng: end?.lng || 0,
            algorithm: "dijkstra",
        },
    });

    return (
        <div className="absolute top-4 left-2 max-w-80 border p-2 rounded z-10 bg-neutral-900 font-mono">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onVisualize)}
                    className="space-y-4 flex flex-col items-center"
                >
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <div>
                                <h3 className="text-lg font-medium">Visualize Path Finding</h3>
                                <p className="text-sm text-muted-foreground">
                                    Select start and end point using latitude and longitude. Use the
                                    desired algorithm and visualize
                                </p>
                            </div>
                            <AccordionTrigger>Enter Position!</AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-row gap-2 items-center justify-center">
                                    <h4 className="text-lg font-medium mt-8">Start</h4>
                                    <FormField
                                        control={form.control}
                                        name="startLat"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Latitude</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="0.0" 
                                                        {...field} 
                                                        value={start?.lat || 0} 
                                                        onChange={(e) => setStart({ ...start!, lat: Number(e.target.value) })}
                                                        />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="startLng"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Longitude</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="0.0" 
                                                        {...field} 
                                                        value={start?.lng || 0} 
                                                        onChange={(e) => setStart({ ...start!, lng: Number(e.target.value) })}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-row gap-2 items-center justify-center">
                                    <h4 className="text-lg font-medium mt-8">End</h4>
                                    <FormField
                                        control={form.control}
                                        name="endLat"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Latitude</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="0.0" 
                                                        {...field} 
                                                        value={end?.lat || 0} 
                                                        onChange={(e) => setEnd({ ...end!, lat: Number(e.target.value) })}    
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="endLng"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Longitude</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="0.0" 
                                                        {...field} 
                                                        value={end?.lng || 0} 
                                                        onChange={(e) => setEnd({ ...end!, lng: Number(e.target.value) })}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <FormField
                        control={form.control}
                        name="algorithm"
                        render={({ field }) => (
                            <div className="flex flex-row items-center gap-2 w-full">
                            <Label htmlFor="algo">Algorithm</Label>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl id="algo">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select path finding algorithm" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="dijkstra">Dijkstra</SelectItem>
                                    <SelectItem value="a_star">A*Star</SelectItem>
                                    <SelectItem value="bellman_ford">Bellman Ford</SelectItem>
                                </SelectContent>
                            </Select>
                            </div>
                        )}
                    />
                    <Button type="submit">Visualize</Button>
                </form>
            </Form>
        </div>
    );
};

export default Controls;
